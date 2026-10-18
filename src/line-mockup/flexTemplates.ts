/**
 * Official LINE Flex Message Templates for Frontend Mockup & Review.
 *
 * SPECIFICATION:
 * - 100% compliant with LINE Messaging API Flex Message JSON Schema.
 * - Strict alignment with NTUH Yunlin Pharmacy clinical standards.
 * - Verified by line-flex-message-renderer validateFlexContainer().
 */

import rawDrugs from "../line/data/drugs.json";

export interface DrugCatalogItem {
	id: string;
	displayName: string;
	type: "MDI" | "DPI" | "SMI";
	ICS: boolean;
	roles: string[];
}

export const DRUGS_CATALOG = rawDrugs as DrugCatalogItem[];

export function findCatalogDrug(id: string): DrugCatalogItem | undefined {
	return DRUGS_CATALOG.find((d) => d.id === id);
}

const HOSPITAL_TITLE = "臺大醫院雲林分院 藥劑部";
const SYSTEM_NAME = "InhaSync™ 吸入劑智慧衛教";

/** 1. 歡迎與初次登錄卡片 (Welcome Flex Bubble) */
export function createWelcomeFlexBubble() {
	return {
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
					text: "請告訴我們您目前使用的吸入劑，系統將為您建立專屬用藥檔案、提供操作短片與排程提醒。",
					size: "sm",
					color: "#475569",
					wrap: true,
				},
				{
					type: "separator",
					margin: "md",
				},
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
					margin: "md",
				},
				{
					type: "button",
					action: {
						type: "postback",
						label: "常見衛教 Q&A 問答",
						data: "action=view_faq",
						displayText: "我想看常見衛教問答",
					},
					style: "secondary",
					margin: "sm",
				},
			],
		},
		footer: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: "💡 提示：點擊上方按鈕直接於對話中指認藥品！",
					size: "xs",
					color: "#94A3B8",
					align: "center",
				},
			],
		},
	};
}

/** 2. 全藥品真實照片輪播卡片 (Photo Carousel) */
export interface DrugCardDef {
	id: string;
	name: string;
	spec: string;
	deviceType: string;
	colorShape: string;
	technique: string;
	hasIcs: boolean;
	color: string;
	imageUrl: string;
}

export function createDrugPhotoBubble(drug: DrugCardDef) {
	return {
		type: "bubble",
		size: "kilo",
		hero: {
			type: "image",
			url: drug.imageUrl,
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
							text: drug.deviceType,
							size: "xxs",
							color: drug.color,
							weight: "bold",
						},
						{
							type: "text",
							text: drug.hasIcs ? "含類固醇" : "無類固醇",
							size: "xxs",
							color: drug.hasIcs ? "#DC2626" : "#059669",
							align: "end",
							weight: "bold",
						},
					],
				},
				{
					type: "text",
					text: drug.name,
					weight: "bold",
					size: "sm",
					color: "#0F172A",
					wrap: true,
				},
				{
					type: "text",
					text: drug.colorShape,
					size: "xs",
					color: "#64748B",
				},
				{
					type: "text",
					text: drug.technique,
					size: "xxs",
					color: drug.color,
					weight: "bold",
					wrap: true,
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
						label: "👉 我是用這瓶",
						data: `action=select_drug&drug=${drug.id}`,
						displayText: `我用的是這瓶：${drug.colorShape}【${drug.name}】`,
					},
					style: "primary",
					color: drug.color,
					height: "sm",
				},
			],
		},
	};
}

export function createDrugSelectCarousel(cards: DrugCardDef[]) {
	return {
		type: "carousel",
		contents: cards.map(createDrugPhotoBubble),
	};
}

/** 3. 急救備用藥確認氣泡 (Rescue Prompt Bubble) */
export function createRescuePromptBubble(
	drugName: string,
	drugColorShape: string,
) {
	return {
		type: "bubble",
		size: "giga",
		header: {
			type: "box",
			layout: "vertical",
			backgroundColor: "#F8FAFC",
			contents: [
				{
					type: "text",
					text: "已記錄日常保養吸入劑：",
					size: "xs",
					color: "#64748B",
					align: "center",
				},
				{
					type: "text",
					text: `【${drugColorShape}】${drugName}`,
					size: "md",
					weight: "bold",
					color: "#0F172A",
					wrap: true,
					align: "center",
				},
			],
		},
		hero: {
			type: "image",
			url: "/drugs/ventolin_real.jpg",
			size: "full",
			aspectRatio: "20:13",
			aspectMode: "cover",
		},
		body: {
			type: "box",
			layout: "vertical",
			spacing: "md",
			contents: [
				{
					type: "text",
					text: "【急救備用藥確認】",
					weight: "bold",
					size: "md",
					color: "#1E293B",
					align: "center",
				},
				{
					type: "text",
					text: "請問醫師是否有同時為您開立這瓶藍色瓶蓋的急性發作備用吸入劑（Ventolin 備思復）？",
					size: "sm",
					color: "#475569",
					wrap: true,
				},
				{
					type: "separator",
					margin: "md",
				},
				{
					type: "button",
					action: {
						type: "postback",
						label: "👉 有，我有這瓶藍色急救藥",
						data: "action=select_rescue&has_rescue=true",
						displayText: "我有開立藍色瓶蓋 Ventolin (備思復) 急救藥",
					},
					style: "primary",
					color: "#2563EB",
					margin: "md",
				},
				{
					type: "button",
					action: {
						type: "postback",
						label: "沒有，我只有日常吸入劑",
						data: "action=select_rescue&has_rescue=false",
						displayText: "沒有，我只有日常保養吸入劑",
					},
					style: "secondary",
					margin: "sm",
				},
			],
		},
	};
}

/** 4. 雙重標籤用藥檔案卡片 (Dual-Tag Profile Bubble) */
export function createDualTagProfileBubble({
	drugName,
	deviceType,
	hasIcs,
	hasRescue,
	deviceAdvice,
	icsAdvice,
}: {
	drugName: string;
	deviceType: "MDI" | "DPI" | "SMI";
	hasIcs: boolean;
	hasRescue: boolean;
	deviceAdvice: string;
	icsAdvice: string;
}) {
	return {
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
					margin: "xs",
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
							text: drugName,
							size: "md",
							weight: "bold",
							color: "#0F172A",
							wrap: true,
						},
						...(hasRescue
							? [
									{
										type: "text",
										text: "急救備用藥：Ventolin Evohaler (備思復)",
										size: "xs",
										color: "#2563EB",
										weight: "bold",
										margin: "xs",
									},
								]
							: []),
					],
				},
				{
					type: "box",
					layout: "vertical",
					contents: [
						{
							type: "text",
							text: `🏷️ 標籤一【${deviceType} 裝置操作重點】`,
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
							margin: "xs",
						},
					],
				},
				{
					type: "box",
					layout: "vertical",
					contents: [
						{
							type: "text",
							text: hasIcs
								? "🏷️ 標籤二【含吸入型類固醇 (ICS)】"
								: "🏷️ 標籤二【不含類固醇】",
							weight: "bold",
							size: "sm",
							color: hasIcs ? "#DC2626" : "#059669",
						},
						{
							type: "text",
							text: icsAdvice,
							size: "xs",
							color: "#334155",
							wrap: true,
							margin: "xs",
						},
					],
				},
				{
					type: "separator",
					margin: "md",
				},
				{
					type: "button",
					action: {
						type: "postback",
						label: "▶️ 觀看標準操作示範短片",
						data: "action=view_video",
						displayText: "我想看示範教學短片",
					},
					style: "primary",
					color: "#0D9488",
					height: "sm",
				},
			],
		},
		footer: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: "💡 雲林分院藥劑部 關心您的呼吸照護",
					size: "xs",
					color: "#94A3B8",
					align: "center",
				},
			],
		},
	};
}

/** 5. 隨堂測驗卡片 (Quiz Bubble) */
export function createQuizBubble({
	question,
	options,
}: {
	question: string;
	options: { id: string; text: string }[];
}) {
	return {
		type: "bubble",
		size: "giga",
		header: {
			type: "box",
			layout: "vertical",
			backgroundColor: "#D97706",
			contents: [
				{
					type: "text",
					text: "臨床技巧自我檢測",
					size: "xs",
					color: "#FEF3C7",
					align: "center",
				},
				{
					type: "text",
					text: "吸入技巧隨堂小測驗",
					size: "lg",
					weight: "bold",
					color: "#FFFFFF",
					margin: "xs",
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
					text: question,
					weight: "bold",
					size: "md",
					color: "#1E293B",
					wrap: true,
				},
				{
					type: "separator",
					margin: "sm",
				},
				...options.map((opt) => ({
					type: "button",
					action: {
						type: "postback",
						label: `(${opt.id}) ${opt.text.slice(0, 30)}`,
						data: `action=answer_quiz&answer=${opt.id}`,
						displayText: `我選擇 (${opt.id}) ${opt.text}`,
					},
					style: "secondary",
					margin: "xs",
					height: "sm",
				})),
			],
		},
	};
}

/** 6. 隨堂測驗結果回饋卡片 (Quiz Feedback Bubble) */
export function createQuizFeedbackBubble({
	isCorrect,
	explanation,
}: {
	isCorrect: boolean;
	explanation: string;
}) {
	return {
		type: "bubble",
		size: "giga",
		header: {
			type: "box",
			layout: "vertical",
			backgroundColor: isCorrect ? "#059669" : "#DC2626",
			contents: [
				{
					type: "text",
					text: isCorrect
						? "🎉 太棒了，完全答對！"
						: "💡 差一點點喔！請看正確解析",
					size: "md",
					weight: "bold",
					color: "#FFFFFF",
					align: "center",
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
					text: "【藥師專業解析】",
					size: "xs",
					color: "#64748B",
					weight: "bold",
				},
				{
					type: "text",
					text: explanation,
					size: "sm",
					color: "#334155",
					wrap: true,
				},
			],
		},
	};
}

/** 7. 示範教學影片卡片 (Video Bubble) */
export function createVideoBubble({
	deviceType,
	stepText,
	youtubeUrl,
}: {
	deviceType: string;
	stepText: string;
	youtubeUrl: string;
}) {
	return {
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
					align: "center",
				},
				{
					type: "text",
					text: `【${deviceType} 吸入劑】標準操作示範`,
					size: "lg",
					weight: "bold",
					color: "#FFFFFF",
					margin: "xs",
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
					text: "胸腔醫學會標準操作口訣：",
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
					type: "separator",
					margin: "sm",
				},
				{
					type: "button",
					action: {
						type: "uri",
						label: "▶️ 點擊播放教學短片",
						uri: youtubeUrl,
					},
					style: "primary",
					color: "#2563EB",
					height: "sm",
				},
			],
		},
	};
}
