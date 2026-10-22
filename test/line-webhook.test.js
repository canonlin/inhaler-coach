import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createRecordingTransport } from "../api/line/transport.mjs";
import { handleLineWebhook } from "../api/line/webhook.mjs";

describe("LINE Bot Conversational Webhook Router", () => {
	function createMockEnv() {
		const capturedSends = [];
		const capturedReplies = [];
		const dbEvents = [];
		const dbMedications = [];

		const transport = createRecordingTransport({
			insert: async (msg) => capturedSends.push(msg),
			recordReply: async (reply) => capturedReplies.push(reply),
		});

		const query = async (sql, params = []) => {
			if (sql.includes("INSERT INTO line_events")) {
				dbEvents.push({
					eventId: params[0],
					type: params[1],
					lineUserId: params[4],
				});
				return { rows: [{ patient_id: 101 }] };
			}
			if (sql.includes("SELECT lm.device_line")) {
				return { rows: [{ device_line: "MDI" }] };
			}
			if (sql.includes("DELETE FROM line_medications")) {
				return { rows: [] };
			}
			if (sql.includes("INSERT INTO line_medications")) {
				dbMedications.push({
					patientId: params[0],
					role: params[1],
					drugId: params[2],
					drugName: params[3],
					deviceLine: params[4],
					ics: params[5],
				});
				return { rows: [] };
			}
			return { rows: [] };
		};

		return {
			transport,
			capturedReplies,
			capturedSends,
			query,
			dbEvents,
			dbMedications,
		};
	}

	it("handles follow event by replying with welcome & registration card", async () => {
		const env = createMockEnv();
		const res = await handleLineWebhook({
			events: [
				{
					type: "follow",
					webhookEventId: "ev-follow-1",
					replyToken: "token-f1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(res.ok, true);
		assert.equal(res.received, 1);
		assert.equal(env.capturedReplies.length, 1);
		assert.equal(env.capturedReplies[0].replyToken, "token-f1");
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /歡迎加入臺大醫院雲林分院/);
	});

	it("handles text message '我的吸入劑' by replying with drug carousel", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "我的吸入劑" },
					webhookEventId: "ev-msg-1",
					replyToken: "token-m1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /吸入劑/);
		assert.equal(msg.contents.type, "carousel");
		assert.equal(
			msg.contents.contents.length,
			6,
			"All 6 clinical drug photo bubbles",
		);
	});

	it("handles text message '操作影片' by replying with tailored video card", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "操作影片" },
					webhookEventId: "ev-video-1",
					replyToken: "token-v1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /MDI 吸入劑 2 分鐘標準操作短片/);
	});

	it("handles text message '隨堂測驗' by replying with quiz card", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "我要做隨堂測驗" },
					webhookEventId: "ev-quiz-1",
					replyToken: "token-q1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /MDI 隨堂小測驗/);
	});

	it("handles text message '回診提醒' by replying with clinic preparation checklist", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "回診提醒" },
					webhookEventId: "ev-clinic-1",
					replyToken: "token-c1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /28 天回診/);
	});

	it("handles text message '常見問答' by replying with 4 fatal errors FAQ", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "常見問題" },
					webhookEventId: "ev-faq-1",
					replyToken: "token-faq1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /4 大常見地雷錯誤/);
	});

	it("handles text message '諮詢藥師' by replying with pharmacist contact card", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text: "諮詢藥師" },
					webhookEventId: "ev-pharm-1",
					replyToken: "token-p1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /藥事諮詢服務專線/);
	});

	it("handles drug selection postback by prompting for rescue inhaler", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "postback",
					postback: { data: "action=select_drug&drug=Symbicort_Rapihaler" },
					webhookEventId: "ev-pb-drug",
					replyToken: "token-pb1",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /急救用吸入劑/);
		assert.equal(
			msg.contents.hero.url,
			"https://inhaler-coach.vercel.app/drugs/ventolin_real.jpg",
		);
	});

	it("handles rescue confirmation postback by saving medications and returning Dual-Tag Profile + Video Card", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "postback",
					postback: {
						data: "action=select_rescue&drug=Symbicort_Rapihaler&has_rescue=true",
					},
					webhookEventId: "ev-pb-rescue",
					replyToken: "token-pb2",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const profileMsg = env.capturedReplies[0].messages[0];
		assert.equal(profileMsg.type, "flex");
		assert.match(profileMsg.altText, /雙重標籤用藥檔案/);

		const videoMsg = env.capturedReplies[0].messages[1];
		assert.equal(videoMsg.type, "flex");
		assert.match(videoMsg.altText, /標準操作短片/);

		// Assert both maintenance and rescue drugs were persisted
		assert.equal(env.dbMedications.length, 2);
		assert.equal(env.dbMedications[0].role, "maintenance");
		assert.equal(env.dbMedications[0].drugId, "Symbicort_Rapihaler");
		assert.equal(env.dbMedications[1].role, "rescue");
		assert.equal(env.dbMedications[1].drugId, "Ventolin_Evohaler");
	});

	it("handles quiz answer postback: correct answer receives congratulations and clinical rationale", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "postback",
					postback: { data: "action=quiz_answer&type=MDI&ans=B" },
					webhookEventId: "ev-pb-ans-b",
					replyToken: "token-pb-ans-b",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /恭喜答對/);
	});

	it("handles quiz answer postback: incorrect answer receives explanation and video review action", async () => {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "postback",
					postback: { data: "action=quiz_answer&type=MDI&ans=A" },
					webhookEventId: "ev-pb-ans-a",
					replyToken: "token-pb-ans-a",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});

		assert.equal(env.capturedReplies.length, 1);
		const msg = env.capturedReplies[0].messages[0];
		assert.equal(msg.type, "flex");
		assert.match(msg.altText, /差一點點|藥師重點解析/);
	});
});

describe("the two-week check", () => {
	function createMockEnv() {
		const capturedReplies = [];
		const transport = createRecordingTransport({
			insert: async () => {},
			recordReply: async (reply) => capturedReplies.push(reply),
		});
		const query = async (sql) => {
			if (sql.includes("SELECT lm.device_line")) {
				return { rows: [{ device_line: "MDI" }] };
			}
			return { rows: [] };
		};
		return { transport, capturedReplies, query };
	}

	async function answer(text) {
		const env = createMockEnv();
		await handleLineWebhook({
			events: [
				{
					type: "message",
					message: { type: "text", text },
					webhookEventId: `ev-selfcheck-${text}`,
					replyToken: "token-sc",
					source: { userId: "U_USER_001" },
				},
			],
			query: env.query,
			transport: env.transport,
		});
		return env.capturedReplies[0]?.messages[0];
	}

	it("acknowledges a patient who says they got it right", async () => {
		const msg = await answer("都做對了");
		assert.equal(msg.type, "text");
		assert.match(msg.text, /做對了/);
	});

	it("names the three usual stumbling blocks to a patient who is struggling", async () => {
		const msg = await answer("還有一兩個不順");
		assert.equal(msg.type, "text");
		assert.match(msg.text, /搖/);
		assert.match(msg.text, /吐氣/);
		assert.match(msg.text, /閉氣 5 秒/);
	});

	it("sends the method again to a patient who has forgotten it", async () => {
		const msg = await answer("忘了怎麼用");
		assert.equal(msg.type, "text");
		assert.match(msg.text, /操作影片/);
	});
});
