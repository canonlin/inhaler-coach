/**
 * Elderly-Friendly, High-Contrast LINE Flex Message Templates.
 *
 * Designed according to NTUH Yunlin Pharmacy clinical specifications and
 * Taiwan Chest Society guidelines.
 *
 * KEY ATTRIBUTES:
 * - High readability for elderly patients (large bold fonts, distinct colored badges).
 * - Conversational UI: Every action is native to LINE (Postback/Message), NO external web links required.
 * - Dual-tag clinical classification: Device (MDI/DPI/SMI) + Steroid (ICS/Non-ICS).
 */

import { findDrug } from "./catalog.mjs";

const HOSPITAL_TITLE = "臺大醫院雲林分院 藥劑部";
const SYSTEM_NAME = "InhaSync™ 吸入劑智慧衛教";

/** 1. 歡迎與初始建檔引導卡片 */
export function buildWelcomeFlex() {
	return {
		type: "flex",
		altText: `歡迎加入${HOSPITAL_TITLE} ${SYSTEM_NAME}`,
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#0D9488",
				paddingTop: "16px",
				paddingBottom: "16px",
				contents: [
					{
						type: "text",
						text: HOSPITAL_TITLE,
						color: "#CCFBF1",
						size: "xs",
						weight: "bold",
						align: "center",
					},
					{
						type: "text",
						text: SYSTEM_NAME,
						color: "#FFFFFF",
						size: "xl",
						weight: "bold",
						margin: "sm",
						align: "center",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: "您好！歡迎加入吸入劑專屬衛教照護。",
						weight: "bold",
						size: "md",
						color: "#1E293B",
						wrap: true,
					},
					{
						type: "text",
						text: "請告訴我們您目前使用的吸入劑，系統將為您建立專屬用藥檔案、提供操作影片與個人化技巧提醒。",
						size: "sm",
						color: "#475569",
						wrap: true,
					},
					{
						type: "box",
						layout: "vertical",
						margin: "lg",
						spacing: "sm",
						contents: [
							{
								type: "button",
								action: {
									type: "postback",
									label: "👉 開始選擇我的吸入劑",
									data: "action=start_register",
									displayText: "我要開始選擇吸入劑",
								},
								style: "primary",
								color: "#0D9488",
								height: "md",
							},
							{
								type: "button",
								action: {
									type: "message",
									label: "常見地雷錯誤防範",
									text: "常見問答",
								},
								style: "secondary",
								color: "#E2E8F0",
								height: "md",
							},
						],
					},
				],
			},
			footer: {
				type: "box",
				layout: "vertical",
				contents: [
					{
						type: "text",
						text: "💡 提示：點擊下方『開始選擇』即可直接在對話中登記！",
						size: "xs",
						color: "#94A3B8",
						align: "center",
					},
				],
			},
		},
	};
}

export const CLINICAL_DRUG_CARDS = [
	{
		id: "Symbicort_Rapihaler",
		name: "都保噴霧 (Symbicort)",
		spec: "Rapihaler 120 puff",
		deviceType: "MDI 定量噴霧",
		colorShape: "🔴 紅白色・L型噴罐",
		technique: "口訣：上下搖勻・慢深吸 5 秒",
		hasIcs: true,
		color: "#2563EB",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/rapihaler.png",
	},
	{
		id: "Relvar_Ellipta",
		name: "易利達 (Relvar Ellipta)",
		spec: "Inhalation Powder 30 dose",
		deviceType: "DPI 乾粉吸入",
		colorShape: "🟡 灰黃色・扁圓盤盒",
		technique: "口訣：推開蓋喀一聲・快深用力吸",
		hasIcs: true,
		color: "#059669",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/ellipta_real.jpg",
	},
	{
		id: "Spiolto_Respimat",
		name: "適倍樂 (Spiolto Respimat)",
		spec: "Respimat 60 puff",
		deviceType: "SMI 軟霧吸入",
		colorShape: "⚪ 灰白色・圓柱長筒",
		technique: "口訣：轉開按・配合軟霧慢深吸",
		hasIcs: false,
		color: "#0D9488",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/respimat_real.jpg",
	},
	{
		id: "Ventolin_Evohaler",
		name: "備思復 (Ventolin Evohaler)",
		spec: "Evohaler 200 dose",
		deviceType: "MDI 急救噴霧",
		colorShape: "🔵 藍色瓶蓋・隨身急救小噴罐",
		technique: "口訣：氣喘發作時吸 1~2 吸",
		hasIcs: false,
		color: "#0284C7",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/ventolin_real.jpg",
	},
	{
		id: "Seretide_Evohaler",
		name: "續利得 (Seretide Evohaler)",
		spec: "Evohaler 120 puff",
		deviceType: "MDI 定量噴霧",
		colorShape: "🟣 紫色・L型噴罐",
		technique: "口訣：上下搖勻・慢深吸 5 秒",
		hasIcs: true,
		color: "#7E22CE",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/seretide_real.jpg",
	},
	{
		id: "Ultibro_Breezhaler",
		name: "昂滋 (Ultibro Breezhaler)",
		spec: "Breezhaler 30 dose",
		deviceType: "DPI 膠囊吸入",
		colorShape: "🟢 藍白色・膠囊雙側按鈕",
		technique: "口訣：刺孔後快深吸・有嗡嗡聲",
		hasIcs: false,
		color: "#0F766E",
		imageUrl: "https://inhaler-coach.vercel.app/drugs/breezhaler_real.jpg",
	},
];

function buildDrugPhotoBubble(drug) {
	const imageUrl =
		drug.imageUrl ||
		drug.image_url ||
		"https://inhaler-coach.vercel.app/drugs/rapihaler.png";
	const deviceType = drug.deviceType || drug.type || "MDI 定量噴霧";
	const hasIcs = Boolean(drug.hasIcs ?? drug.ICS);
	const color = drug.color || "#0D9488";
	const name = drug.name || drug.displayName || drug.id;
	const colorShape = drug.colorShape || "";
	const technique = drug.technique || "";

	return {
		type: "bubble",
		size: "kilo",
		hero: {
			type: "image",
			url: imageUrl,
			size: "full",
			aspectRatio: "20:13",
			aspectMode: "cover",
		},
		body: {
			type: "box",
			layout: "vertical",
			spacing: "xs",
			paddingAll: "14px",
			contents: [
				{
					type: "box",
					layout: "horizontal",
					contents: [
						{
							type: "text",
							text: deviceType,
							size: "xxs",
							color: color,
							weight: "bold",
						},
						{
							type: "text",
							text: hasIcs ? "含類固醇" : "無類固醇",
							size: "xxs",
							color: hasIcs ? "#DC2626" : "#059669",
							align: "end",
							weight: "bold",
						},
					],
				},
				{
					type: "text",
					text: name,
					weight: "bold",
					size: "sm",
					color: "#0F172A",
					wrap: true,
				},
				colorShape
					? {
							type: "text",
							text: colorShape,
							size: "xs",
							color: "#64748B",
						}
					: {
							type: "filler",
						},
				technique
					? {
							type: "text",
							text: technique,
							size: "xxs",
							color: color,
							weight: "bold",
							wrap: true,
						}
					: {
							type: "filler",
						},
			],
		},
		footer: {
			type: "box",
			layout: "vertical",
			paddingAll: "12px",
			paddingTop: "0px",
			contents: [
				{
					type: "button",
					action: {
						type: "postback",
						label: `👉 我是用這瓶`,
						data: `action=select_drug&drug=${drug.id}`,
						displayText: `我用的是這瓶：${colorShape ? `${colorShape} ` : ""}【${name}】`,
					},
					style: "primary",
					color: color,
					height: "sm",
				},
			],
		},
	};
}

/** 2. 全藥品實物圖片輪播卡片 (Photo Carousel) - 直覺指認實物外觀 */
export function buildDrugSelectCarousel(drugsList) {
	const source =
		Array.isArray(drugsList) && drugsList.length > 0
			? drugsList
			: CLINICAL_DRUG_CARDS;
	const activeList = source
		.filter((d) => d.enabled !== false && d.status !== "inactive")
		.slice(0, 10);

	if (activeList.length === 0) {
		return {
			type: "text",
			text: "目前藥品清單正在維護更新中，請稍候再試或直接向雲林分院藥師諮詢。",
		};
	}

	return {
		type: "flex",
		altText: "請左右滑動照片，點選與您手中一模一樣的吸入劑",
		contents: {
			type: "carousel",
			contents: activeList.map(buildDrugPhotoBubble),
		},
	};
}

/** 3. 詢問是否有急救備用藥（Ventolin） */
export function buildRescuePromptFlex(maintenanceDrugId) {
	const drug = findDrug(maintenanceDrugId);
	const drugName = drug ? drug.displayName : maintenanceDrugId;

	return {
		type: "flex",
		altText: "請問您是否同時有開立急救用吸入劑（備思復 Ventolin）？",
		contents: {
			type: "bubble",
			size: "giga",
			hero: {
				type: "image",
				url: "https://inhaler-coach.vercel.app/drugs/ventolin_real.jpg",
				size: "full",
				aspectRatio: "20:13",
				aspectMode: "cover",
			},
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#F8FAFC",
				contents: [
					{
						type: "text",
						text: "已記錄日常保養藥物",
						size: "xs",
						color: "#64748B",
						align: "center",
					},
					{
						type: "text",
						text: drugName,
						size: "md",
						weight: "bold",
						color: "#0F172A",
						wrap: true,
						align: "center",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: "【急救用藥確認】\n請問醫師是否有為您同時開立急性發作備用的吸入劑（例如藍色瓶蓋的『備思復 Ventolin』）？",
						size: "sm",
						color: "#334155",
						wrap: true,
						weight: "bold",
					},
					{
						type: "button",
						action: {
							type: "postback",
							label: "有，我有 Ventolin (備思復)",
							data: `action=select_rescue&drug=${maintenanceDrugId}&has_rescue=true`,
							displayText: "我有開立 Ventolin 急救藥",
						},
						style: "primary",
						color: "#2563EB",
					},
					{
						type: "button",
						action: {
							type: "postback",
							label: "沒有，只有這瓶日常吸入劑",
							data: `action=select_rescue&drug=${maintenanceDrugId}&has_rescue=false`,
							displayText: "沒有，我只有日常保養吸入劑",
						},
						style: "secondary",
					},
				],
			},
		},
	};
}

/** 4. 雙重標籤用藥檔案卡片 (Dual-Tag Profile) */
export function buildDualTagProfileFlex({ drug, hasRescue }) {
	const deviceAdvice =
		drug.type === "MDI"
			? "使用前上下充分搖晃 5 秒；按壓藥罐同時慢深吸氣 5 秒鐘。"
			: drug.type === "DPI"
				? "向下滑開外蓋備藥完成；含緊吸嘴後『快速、深長、用力』吸氣到底。"
				: "旋轉透明底座掀開蓋子；按下按鈕同時配合微細軟霧緩慢深長吸氣。";

	const icsAdvice = drug.ICS
		? "⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染或聲音沙啞！"
		: "✅ 本藥品【不含類固醇】：吸藥後不強制深部漱口，但建議仍可飲水潤喉清潔。";

	return {
		type: "flex",
		altText: `您的吸入劑雙重標籤用藥檔案：${drug.displayName}`,
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#065F46",
				contents: [
					{
						type: "text",
						text: "臺大醫院雲林分院 藥事照護檔案",
						size: "xs",
						color: "#A7F3D0",
						align: "center",
					},
					{
						type: "text",
						text: "雙重標籤用藥檔案卡",
						size: "xl",
						weight: "bold",
						color: "#FFFFFF",
						align: "center",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "box",
						layout: "vertical",
						backgroundColor: "#F1F5F9",
						paddingAll: "12px",
						cornerRadius: "8px",
						contents: [
							{
								type: "text",
								text: "日常保養用藥：",
								size: "xs",
								color: "#64748B",
							},
							{
								type: "text",
								text: drug.displayName,
								size: "md",
								weight: "bold",
								color: "#0F172A",
								wrap: true,
							},
							hasRescue
								? {
										type: "text",
										text: "急救備用藥：Ventolin Evohaler (備思復)",
										size: "xs",
										color: "#2563EB",
										weight: "bold",
										margin: "xs",
									}
								: {
										type: "filler",
									},
						],
					},
					// 標籤一
					{
						type: "box",
						layout: "vertical",
						spacing: "xs",
						contents: [
							{
								type: "text",
								text: `🏷️ 標籤一【${drug.type} 裝置分類】`,
								weight: "bold",
								size: "sm",
								color: "#0F766E",
							},
							{
								type: "text",
								text: deviceAdvice,
								size: "xs",
								color: "#334155",
								wrap: true,
							},
						],
					},
					// 標籤二
					{
						type: "box",
						layout: "vertical",
						spacing: "xs",
						contents: [
							{
								type: "text",
								text: `🏷️ 標籤二【${drug.ICS ? "含吸入型類固醇" : "無類固醇"}】`,
								weight: "bold",
								size: "sm",
								color: drug.ICS ? "#B91C1C" : "#047857",
							},
							{
								type: "text",
								text: icsAdvice,
								size: "xs",
								color: "#334155",
								wrap: true,
							},
						],
					},
					// 底部按鈕
					{
						type: "box",
						layout: "horizontal",
						spacing: "sm",
						margin: "md",
						contents: [
							{
								type: "button",
								action: {
									type: "postback",
									label: "▶️ 看示範影片",
									data: `action=view_video&type=${drug.type}`,
									displayText: `觀看 ${drug.type} 操作示範短片`,
								},
								style: "primary",
								color: "#0D9488",
								height: "sm",
							},
							{
								type: "button",
								action: {
									type: "postback",
									label: "✍️ 做隨堂測驗",
									data: `action=start_quiz&type=${drug.type}`,
									displayText: `進行 ${drug.type} 隨堂自我檢測`,
								},
								style: "secondary",
								height: "sm",
							},
						],
					},
				],
			},
		},
	};
}

/** 5. 示範影片卡片 (Video Card) */
export function buildVideoCardFlex({ deviceType, videoInfo }) {
	const defaultSteps =
		deviceType === "MDI"
			? "1. 充分上下搖勻 5 秒\n2. 先吐氣到底（遠離吸嘴）\n3. 緊含吸嘴，按壓同時慢深吸氣 5 秒\n4. 移開吸嘴閉氣 5 秒以上\n5. 若含類固醇記得漱口"
			: deviceType === "DPI"
				? "1. 撥開外蓋聽到喀聲完成備藥\n2. 先吐氣到底（切勿對吸嘴吹氣）\n3. 緊含吸嘴，快速深長用力吸到底\n4. 移開吸嘴閉氣 5 秒以上\n5. 若含類固醇記得漱口"
				: "1. 旋轉底座掀開保護蓋\n2. 先吐氣到底（遠離吸嘴）\n3. 緊含吸嘴，按鈕配合軟霧慢深吸氣\n4. 移開吸嘴閉氣 5 秒以上\n5. 關上保護蓋防塵";

	const stepText = videoInfo?.description || videoInfo?.steps || defaultSteps;
	const title = videoInfo?.title || `【${deviceType} 吸入劑】標準操作示範`;
	const videoUrl =
		videoInfo?.videoUrl ||
		videoInfo?.url ||
		"https://www.youtube.com/results?search_query=%E5%8F%B0%E5%A4%A7%E9%86%AB%E9%99%A2+%E5%90%B8%E5%85%A5%E5%8A%99%E6%95%99%E5%AD%B8";

	return {
		type: "flex",
		altText: `${deviceType} 吸入劑 2 分鐘標準操作短片`,
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#1E3A8A",
				contents: [
					{
						type: "text",
						text: "臨床衛教短片・2分鐘掌握",
						size: "xs",
						color: "#93C5FD",
					},
					{
						type: "text",
						text: title,
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: "胸腔醫學會標準 5 大步驟：",
						weight: "bold",
						size: "sm",
						color: "#0F172A",
					},
					{
						type: "text",
						text: stepText,
						size: "xs",
						color: "#334155",
						wrap: true,
					},
					{
						type: "button",
						action: {
							type: "uri",
							label: "▶️ 立即觀看示範短片 (約2分鐘)",
							uri: videoUrl,
						},
						style: "primary",
						color: "#2563EB",
						height: "md",
					},
				],
			},
		},
	};
}

/** 6. 隨堂測驗題目卡片 (Quiz Card) */
export function buildQuizCardFlex({ deviceType, quizInfo }) {
	let qInfo;
	if (quizInfo?.question) {
		qInfo = {
			title: quizInfo.title || `${deviceType} 隨堂小測驗`,
			q: quizInfo.question,
			options: quizInfo.options || [],
		};
	} else {
		qInfo =
			deviceType === "MDI"
				? {
						title: "MDI 隨堂小測驗",
						q: "使用 MDI 定量噴霧吸入劑時，吸氣與按壓的正確配合方式為何？",
						options: [
							{ id: "A", text: "先按壓藥罐噴出，再把嘴巴湊上去吸" },
							{ id: "B", text: "按壓藥罐的瞬間，同步緩慢且深長吸氣 5 秒" },
							{ id: "C", text: "快速大口吸一瞬間，不需要按壓" },
						],
					}
				: deviceType === "DPI"
					? {
							title: "DPI 隨堂小測驗",
							q: "使用 DPI 乾粉吸入劑（如易利達/都保）時，正確的吸氣方式是哪一項？",
							options: [
								{ id: "A", text: "深、快、用力且平穩地吸氣到底" },
								{ id: "B", text: "非常緩慢輕柔地吸氣" },
								{ id: "C", text: "對著吸入器吸嘴往裡面大力吐氣" },
							],
						}
					: {
							title: "SMI 隨堂小測驗",
							q: "使用 SMI 軟霧吸入劑（適倍樂 Respimat）時，吸氣與按壓的配合方式為何？",
							options: [
								{ id: "A", text: "按下釋放鈕的同時，緩慢且深長吸氣" },
								{ id: "B", text: "按下之後憋氣 10 秒，再大口用力吸" },
								{ id: "C", text: "像抽煙一樣快速吸入一小口" },
							],
						};
	}

	return {
		type: "flex",
		altText: `${qInfo.title}：${qInfo.q}`,
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#4338CA",
				contents: [
					{
						type: "text",
						text: "臨床自我檢測・第24天能力確認",
						size: "xs",
						color: "#C7D2FE",
					},
					{
						type: "text",
						text: qInfo.title,
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: qInfo.q,
						weight: "bold",
						size: "sm",
						color: "#1E1B4B",
						wrap: true,
					},
					{
						type: "box",
						layout: "vertical",
						spacing: "sm",
						contents: qInfo.options.map((opt) => ({
							type: "button",
							action: {
								type: "postback",
								label: `(${opt.id}) ${opt.text}`,
								data: `action=quiz_answer&type=${deviceType}&ans=${opt.id}`,
								displayText: `我選擇 (${opt.id})：${opt.text}`,
							},
							style: "secondary",
							height: "sm",
						})),
					},
				],
			},
		},
	};
}

/** 7. 隨堂測驗結果與藥師解析卡片 (Quiz Feedback) */
export function buildQuizFeedbackFlex({
	deviceType,
	chosenAns,
	isCorrect,
	explanation,
}) {
	return {
		type: "flex",
		altText: isCorrect
			? "隨堂測驗：🎉 恭喜答對！"
			: "隨堂測驗：💡 藥師重點解析",
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: isCorrect ? "#047857" : "#D97706",
				contents: [
					{
						type: "text",
						text: isCorrect
							? "🎉 恭喜您！完全答對！"
							: "💡 差一點點！藥師重點解析",
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: `您的回答：選項 (${chosenAns})`,
						size: "xs",
						color: "#64748B",
					},
					{
						type: "text",
						text: "【臨床衛教原理解析】",
						weight: "bold",
						size: "sm",
						color: "#0F172A",
					},
					{
						type: "text",
						text: explanation,
						size: "sm",
						color: "#334155",
						wrap: true,
					},
					{
						type: "box",
						layout: "horizontal",
						spacing: "sm",
						contents: [
							{
								type: "button",
								action: {
									type: "postback",
									label: "複習操作影片",
									data: `action=view_video&type=${deviceType}`,
									displayText: `我想複習 ${deviceType} 操作影片`,
								},
								style: "primary",
								color: "#0D9488",
								height: "sm",
							},
							{
								type: "button",
								action: {
									type: "message",
									label: "常見地雷錯誤",
									text: "常見問答",
								},
								style: "secondary",
								height: "sm",
							},
						],
					},
				],
			},
		},
	};
}

/** 8. 4 大常見地雷錯誤防範卡片 (FAQ) */
export function buildFaqFlex() {
	return {
		type: "flex",
		altText: "吸入劑 4 大常見地雷錯誤防範須知",
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#B91C1C",
				contents: [
					{
						type: "text",
						text: "臨床 QCC 品質指引",
						size: "xs",
						color: "#FEE2E2",
					},
					{
						type: "text",
						text: "吸入劑 4 大常見地雷錯誤",
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "sm",
				contents: [
					{
						type: "text",
						text: "1. ❌ 忘記搖晃 (MDI)：藥物沉澱分層，吸進去只有推進氣體沒有藥。",
						size: "xs",
						color: "#1E293B",
						wrap: true,
					},
					{
						type: "text",
						text: "2. ❌ 吸前未吐氣：肺部殘餘氣體沒吐出，導致吸氣量太淺太短。",
						size: "xs",
						color: "#1E293B",
						wrap: true,
					},
					{
						type: "text",
						text: "3. ❌ 壓吸不同步 / 流速錯誤：MDI 吸太快藥卡喉嚨；DPI 吸太慢乾粉無法解聚。",
						size: "xs",
						color: "#1E293B",
						wrap: true,
					},
					{
						type: "text",
						text: "4. ❌ 吸完未閉氣 5 秒：藥物未能在肺泡沉降，直接隨吐氣散失。",
						size: "xs",
						color: "#1E293B",
						wrap: true,
					},
					{
						type: "text",
						text: "5. ❌ 類固醇未漱口：殘留口腔易造成聲音沙啞或白色念珠菌感染。",
						size: "xs",
						color: "#B91C1C",
						weight: "bold",
						wrap: true,
					},
				],
			},
		},
	};
}

/** 9. 28 天回診提醒卡片 (Clinic Reminder) */
export function buildClinicReminderFlex() {
	return {
		type: "flex",
		altText: "InhaSync™ 28 天回診領藥與技巧複核提醒",
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#0284C7",
				contents: [
					{
						type: "text",
						text: "用藥週期檢核",
						size: "xs",
						color: "#E0F2FE",
					},
					{
						type: "text",
						text: "Day 28 回診領藥提醒",
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: "回診前請備妥三件事：",
						weight: "bold",
						size: "sm",
						color: "#0F172A",
					},
					{
						type: "text",
						text: "1. 檢查目前吸入劑劑量計數視窗剩餘次數。\n2. 請將『目前使用的吸入器』隨身帶回門診藥局。\n3. 藥師將現場為您進行 5 步驟吸入技巧複查，確保用藥療效！",
						size: "xs",
						color: "#334155",
						wrap: true,
					},
				],
			},
		},
	};
}

/** 10. 藥師諮詢服務卡片 (Pharmacist Consult) */
export function buildPharmacistConsultFlex() {
	return {
		type: "flex",
		altText: "臺大醫院雲林分院 藥事諮詢服務專線",
		contents: {
			type: "bubble",
			size: "giga",
			header: {
				type: "box",
				layout: "vertical",
				backgroundColor: "#059669",
				contents: [
					{
						type: "text",
						text: "專業藥師諮詢窗口",
						size: "xs",
						color: "#D1FAE5",
					},
					{
						type: "text",
						text: "臺大醫院雲林分院 藥劑部",
						size: "lg",
						weight: "bold",
						color: "#FFFFFF",
					},
				],
			},
			body: {
				type: "box",
				layout: "vertical",
				spacing: "md",
				contents: [
					{
						type: "text",
						text: "📍 地點：斗六院區 / 虎尾院區 門診藥事諮詢室\n⏰ 服務時間：週一至週五 08:30 - 17:00\n📞 諮詢專線：(05) 532-3911 轉 藥劑部",
						size: "xs",
						color: "#334155",
						wrap: true,
					},
					{
						type: "button",
						action: {
							type: "uri",
							label: "📞 撥打藥劑部諮詢電話",
							uri: "tel:055323911",
						},
						style: "primary",
						color: "#059669",
						height: "md",
					},
				],
			},
		},
	};
}
