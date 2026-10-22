/**
 * LINE Messaging API Webhook Router & Conversational Engine.
 *
 * Implements LINE Bot-First Conversational UI (Zero External Page Dependencies):
 * - Follow: In-chat Welcome & Registration prompt.
 * - Message: Text keyword routing for Rich Menu items (My Inhaler, Videos, Quiz, Return Clinic, FAQ, Pharmacist).
 * - Postback: Interactive in-chat Drug Selection, Rescue Confirmation, Dual-Tag Profile Card, Video Card, and Quiz answering.
 *
 * Quota Discipline:
 * All replies use the Webhook `replyToken`, consuming 0 NTD and 0 push messages against the 200/mo quota.
 */

import { findDrug, RESCUE_ONLY_ID } from "./catalog.mjs";
import {
	DEFAULT_QUIZZES,
	findActiveQuiz,
	findActiveVideo,
	findAlternateVideo,
	getDynamicConfig,
	loadLineContent,
} from "./config.mjs";
import {
	buildClinicReminderFlex,
	buildDrugSelectCarousel,
	buildDualTagProfileFlex,
	buildFaqFlex,
	buildPharmacistConsultFlex,
	buildQuizCardFlex,
	buildQuizFeedbackFlex,
	buildRescuePromptFlex,
	buildVideoCardFlex,
	buildWelcomeFlex,
} from "./flex.mjs";

const quizzes = DEFAULT_QUIZZES ?? {};

async function recordRawEvent(ev, query) {
	const { type, source, webhookEventId } = ev;
	const lineUserId = source?.userId;
	if (!lineUserId || !query) return null;

	try {
		const { rows } = await query(
			`INSERT INTO line_events (patient_id, line_event_id, event_type, step_code, payload)
			 SELECT li.patient_id, $1, $2, $3, $4::jsonb
			 FROM line_identities li WHERE li.line_user_id = $5
			 ON CONFLICT (line_event_id) DO NOTHING
			 RETURNING patient_id`,
			[
				webhookEventId || `synthetic-${Date.now()}-${Math.random()}`,
				type,
				ev.stepCode ?? null,
				JSON.stringify(ev),
				lineUserId,
			],
		);
		return rows[0]?.patient_id ?? null;
	} catch (err) {
		console.error(
			"[line/webhook] recordRawEvent failed gracefully:",
			err.message,
		);
		return null;
	}
}

function buildDefaultHelpMenu() {
	return {
		type: "text",
		text: "您好！我是臺大醫院雲林分院 InhaSync™ 吸入劑智慧衛教小助手。\n\n請點擊下方選單或按鈕，我會立即為您服務：",
		quickReply: {
			items: [
				{
					type: "action",
					action: {
						type: "message",
						label: "我的吸入劑",
						text: "我的吸入劑",
					},
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "操作影片",
						text: "操作影片",
					},
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "隨堂測驗",
						text: "隨堂測驗",
					},
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "常見地雷",
						text: "常見問答",
					},
				},
				{
					type: "action",
					action: {
						type: "message",
						label: "諮詢藥師",
						text: "諮詢藥師",
					},
				},
			],
		},
	};
}

/**
 * The films the bot may show.
 *
 * Read through loadLineContent, the same place the dispatcher reads them.
 * The webhook used to read admin_config on its own with no fallback, so a
 * deployment whose console had never been used showed no film at all while
 * the scheduler believed it had sent one. One definition of "the current
 * film" means both readers answer with the same card.
 */
async function loadVideos(query) {
	const { videos } = await loadLineContent(query);
	return videos;
}

/**
 * The instruction film for one device, and the 台語 version if there is one.
 *
 * A drug-specific film wins over the generic device film: two pMDIs can still
 * need different instructions. When the patient has no film of their own, the
 * card falls back to the society's own manual playlist rather than a dead end.
 *
 * @param {object[]|null} videos
 * @param {string} deviceType
 * @param {string|null} drugId
 */
function buildVideoReply({ videos, deviceType, drugId = null }) {
	const videoInfo = findActiveVideo(videos, deviceType, drugId);
	if (!videoInfo) {
		if (Array.isArray(videos) && videos.length > 0) {
			return {
				type: "text",
				text: "目前該衛教影片正在更新調整中，暫停播放。如有任何操作疑問，歡迎直接點選『諮詢藥師』由雲林分院藥師為您說明！",
			};
		}
		return buildVideoCardFlex({ deviceType, videoInfo: null });
	}
	return buildVideoCardFlex({
		deviceType,
		videoInfo,
		altVideo: findAlternateVideo(videos, deviceType, drugId),
	});
}

async function routeTextMessage(text, lineUserId, query) {
	if (/選藥|我的吸入劑|報到|開始選擇/i.test(text)) {
		const drugs = await getDynamicConfig(query, "drugs", null);
		return buildDrugSelectCarousel(drugs);
	}
	if (/操作影片|影片|教學|看影片/i.test(text)) {
		const { deviceLine, drugId } = await lookupPatientMedication(
			query,
			lineUserId,
		);
		const videos = await loadVideos(query);
		return buildVideoReply({ videos, deviceType: deviceLine, drugId });
	}
	if (/隨堂測驗|測驗|考試|自我測驗/i.test(text)) {
		const deviceType = (await lookupPatientDevice(query, lineUserId)) || "MDI";
		const quizData = await getDynamicConfig(query, "quizzes", quizzes);
		const quizInfo = findActiveQuiz(quizData, deviceType);
		if (!quizInfo && quizData?.[deviceType]) {
			return {
				type: "text",
				text: "目前該裝置隨堂測驗題目正在由藥師調整更新中，稍後將重新開放，謝謝您的耐心配合！",
			};
		}
		return buildQuizCardFlex({ deviceType, quizInfo });
	}
	if (/回診|回診提醒/i.test(text)) {
		return buildClinicReminderFlex();
	}
	// The two-week check asks a closed question, so the answer is one tap.
	// Answering it is the point: the reply is what tells the pharmacist this
	// patient is doing well, and it is free.
	if (/都做對了|都正確|沒問題了/i.test(text)) {
		return {
			type: "text",
			text: "做對了，繼續保持！\n如果之後有任何操作上的不順，隨時點下面選單「諮詢藥師」，我們會協助您。",
		};
	}
	if (/還有一兩個不順|有一兩個不順|不太順/i.test(text)) {
		return {
			type: "text",
			text: "了解，最常見的三個卡關點是：\n1. 忘記搖晃\n2. 吸之前沒有先吐氣\n3. 吸完沒有閉氣 5 秒\n\n點下面選單「操作影片」看一次 2 分鐘示範，通常就會順了。回診時也可以請藥師現場教您一次。",
		};
	}
	if (/忘了怎麼用|忘記怎麼用/i.test(text)) {
		return {
			type: "text",
			text: "沒關係，我們把方法再送一次給您：\n點下面選單「操作影片」看 2 分鐘示範，「常見問題」裡有 4 大地雷錯誤。\n還是記不起來的話，回診時請藥師現場複核一次最安心。",
		};
	}
	if (/常見問題|常見問答|地雷|qa/i.test(text)) {
		return buildFaqFlex();
	}
	if (/諮詢藥師|諮詢|藥師|電話/i.test(text)) {
		return buildPharmacistConsultFlex();
	}
	return buildDefaultHelpMenu();
}

async function persistMedications(patientId, query, drug, hasRescue) {
	if (!patientId || !query) return;
	try {
		await query("DELETE FROM line_medications WHERE patient_id = $1", [
			patientId,
		]);
		await query(
			`INSERT INTO line_medications (patient_id, role, drug_id, drug_name, device_line, ics)
			 VALUES ($1, $2, $3, $4, $5, $6)`,
			[
				patientId,
				"maintenance",
				drug.id,
				drug.displayName,
				drug.type,
				Boolean(drug.ICS),
			],
		);
		if (hasRescue) {
			const rescueDrug = findDrug(RESCUE_ONLY_ID);
			if (rescueDrug) {
				await query(
					`INSERT INTO line_medications (patient_id, role, drug_id, drug_name, device_line, ics)
					 VALUES ($1, $2, $3, $4, $5, $6)`,
					[
						patientId,
						"rescue",
						rescueDrug.id,
						rescueDrug.displayName,
						rescueDrug.type,
						Boolean(rescueDrug.ICS),
					],
				);
			}
		}
	} catch (err) {
		console.error(
			"[line/webhook] persistMedications failed gracefully:",
			err.message,
		);
	}
}

async function routePostback(params, patientId, query) {
	const action = params.get("action");
	if (action === "start_register") {
		const drugs = await getDynamicConfig(query, "drugs", null);
		return buildDrugSelectCarousel(drugs);
	}
	if (action === "select_drug") {
		return buildRescuePromptFlex(params.get("drug"));
	}
	if (action === "select_rescue") {
		const drugId = params.get("drug");
		const hasRescue = params.get("has_rescue") === "true";
		const drug = findDrug(drugId);
		if (!drug) {
			return {
				type: "text",
				text: `找不到藥品資料：${drugId}，請點選選單重新選擇。`,
			};
		}
		await persistMedications(patientId, query, drug, hasRescue);
		const videos = await loadVideos(query);
		return [
			buildDualTagProfileFlex({ drug, hasRescue }),
			buildVideoReply({
				videos,
				deviceType: drug.type,
				drugId: drug.id,
			}),
		];
	}
	if (action === "view_video") {
		const deviceType = params.get("type") || "MDI";
		const drugId = params.get("drug") || null;
		const videos = await loadVideos(query);
		return buildVideoReply({ videos, deviceType, drugId });
	}
	if (action === "start_quiz") {
		const deviceType = params.get("type") || "MDI";
		const quizData = await getDynamicConfig(query, "quizzes", quizzes);
		const quizInfo = findActiveQuiz(quizData, deviceType);
		if (!quizInfo && quizData?.[deviceType]) {
			return {
				type: "text",
				text: "目前該裝置隨堂測驗題目正在由藥師調整更新中，稍後將重新開放，謝謝您的耐心配合！",
			};
		}
		return buildQuizCardFlex({ deviceType, quizInfo });
	}
	if (action === "quiz_answer") {
		const deviceType = params.get("type") || "MDI";
		const ans = params.get("ans");
		const quizData = await getDynamicConfig(query, "quizzes", quizzes);
		const q = quizData?.[deviceType]?.[0] || quizData?.[deviceType];
		const isCorrect = q?.correctAnswer === ans;
		const explanation =
			q?.explanation || "請牢記吸入劑五大標準步驟，依裝置特性配合吸氣與閉氣。";
		return buildQuizFeedbackFlex({
			deviceType,
			chosenAns: ans,
			isCorrect,
			explanation,
		});
	}
	return null;
}

/**
 * Handle incoming LINE Messaging API Webhooks.
 *
 * @param {{
 *   events: Array<object>,
 *   query: Function,
 *   transport: {reply?: Function, channel: string},
 *   salt?: string
 * }} deps
 */
export async function handleLineWebhook({ events = [], query, transport }) {
	const results = [];

	for (const ev of events) {
		const { type, source, replyToken, webhookEventId } = ev;
		const lineUserId = source?.userId;

		// 1. Record raw event in line_events for engagement audit
		const patientId = await recordRawEvent(ev, query);

		// 2. Dispatch Conversational Replies
		let replyMessage = null;
		if (type === "follow") {
			replyMessage = buildWelcomeFlex();
		} else if (type === "message" && ev.message?.type === "text") {
			replyMessage = await routeTextMessage(
				String(ev.message.text).trim(),
				lineUserId,
				query,
			);
		} else if (type === "postback") {
			const data = ev.postback?.data || "";
			const params = new URLSearchParams(data);
			replyMessage = await routePostback(params, patientId, query);
		}

		// 3. Deliver via replyToken (free, 0 NTD)
		if (replyMessage && replyToken && transport?.reply) {
			await transport.reply(replyToken, replyMessage);
		}

		results.push({
			eventId: webhookEventId,
			type,
			replied: Boolean(replyMessage),
		});
	}

	return {
		ok: true,
		received: events.length,
		processed: results,
	};
}

async function lookupPatientDevice(query, lineUserId) {
	if (!query || !lineUserId) return "MDI";
	try {
		const { rows } = await query(
			`SELECT lm.device_line FROM line_medications lm
			 JOIN line_identities li ON li.patient_id = lm.patient_id
			 WHERE li.line_user_id = $1 AND lm.role = 'maintenance'
			 LIMIT 1`,
			[lineUserId],
		);
		return rows[0]?.device_line || "MDI";
	} catch {
		return "MDI";
	}
}

/**
 * The patient's own medicine and device class, from what they registered.
 *
 * The drug matters: the society publishes a film per medicine, and the
 * patient's own is more useful than the generic one for their device.
 *
 * @param {Function} query
 * @param {string} lineUserId
 */
async function lookupPatientMedication(query, lineUserId) {
	if (!query || !lineUserId) return { deviceLine: "MDI", drugId: null };
	try {
		const { rows } = await query(
			`SELECT lm.device_line, lm.drug_id FROM line_medications lm
			 JOIN line_identities li ON li.patient_id = lm.patient_id
			 WHERE li.line_user_id = $1 AND lm.role = 'maintenance'
			 LIMIT 1`,
			[lineUserId],
		);
		return {
			deviceLine: rows[0]?.device_line || "MDI",
			drugId: rows[0]?.drug_id || null,
		};
	} catch {
		return { deviceLine: "MDI", drugId: null };
	}
}

export default async function handler(req, res) {
	const { default: indexHandler } = await import("../index.mjs");
	return indexHandler(req, res);
}
