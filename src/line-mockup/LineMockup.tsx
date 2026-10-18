/**
 * LINE Inhaler Coach — Pharmacist Clinical Review Mockup.
 *
 * PURPOSE:
 * Interactive clinical review cockpit specifically built for presenting,
 * evaluating, and aligning the conversational LINE Bot workflow with the
 * Department of Pharmacy at NTU Hospital Yunlin Branch (臺大醫院雲林分院藥劑部).
 *
 * KEY ARCHITECTURAL & CLINICAL PRINCIPLES:
 * 1. 100% Authentic LINE Messaging API Flex Message JSON Specification:
 *    - Strict adherence to LINE Flex Message Box, Text, Button, and Carousel schemas.
 *    - NO fabricated web radio buttons or checkboxes inside messages (messages in LINE are immutable).
 *    - Interaction is powered by native Postback & Message actions triggering outgoing user messages.
 * 2. Elderly-Friendly Clinical Onboarding (Addressing Yunlin Elderly Demographics):
 *    - Elderly patients (60-85 yrs) do NOT know "MDI/DPI/SMI" or English brand names.
 *    - Dual Onboarding Modalities:
 *      A. Prescription QR Code Auto-fill (雲林分院藥袋 QR 碼自動帶入處方，長輩零認知負擔，按確認即可).
 *      B. Visual Feature Carousel (外觀顏色＋形狀口訣＋中文大字俗名指認：紅白色L型都保、灰黃色扁圓易利達、灰白色長筒適倍樂).
 * 3. Exact Dual-Tag Clinical Profile (雙重標籤用藥檔案卡):
 *    - Device Type (MDI/DPI/SMI) + Steroid/ICS (含類固醇需深部漱口 vs 無類固醇).
 *    - Direct correspondence with backend `api/line/flex.mjs` templates.
 * 4. Zero Escaped Bug Formatting:
 *    - Real multiline formatting; no escaped `\n\n` artifacts in the chat stream.
 */

import {
	Award,
	CheckCircle2,
	ChevronRight,
	Info,
	Menu,
	Play,
	QrCode,
	RotateCcw,
	Search,
	ShieldCheck,
	Sparkles,
	Volume2,
	X,
} from "lucide-react";
import { useState } from "react";

import { FlexHarness } from "./FlexHarness";
import {
	createDrugSelectCarousel,
	createDualTagProfileBubble,
	createQuizBubble,
	createQuizFeedbackBubble,
	createRescuePromptBubble,
	createVideoBubble,
	createWelcomeFlexBubble,
} from "./flexTemplates";
import { RichMenu, type RichMenuAction } from "./RichMenu";

/* -------------------------------------------------------------------------- */
/*                               PERSONA TYPES                                */
/* -------------------------------------------------------------------------- */

export type PatientPersona = "mdi_patient" | "dpi_patient" | "smi_patient";

export interface PersonaConfig {
	id: PatientPersona;
	name: string;
	desc: string;
	deviceType: "MDI" | "DPI" | "SMI";
	colorShape: string;
	chineseName: string;
	maintenanceDrug: string;
	rescueDrug?: string;
	dosageInstruction: string;
	hasIcs: boolean;
	prepAction: string;
	inhaleAction: string;
	deviceAdvice: string;
	icsAdvice: string;
	quizQuestion: {
		q: string;
		options: { id: string; text: string; correct: boolean }[];
		explanation: string;
	};
}

export const PERSONAS: Record<PatientPersona, PersonaConfig> = {
	mdi_patient: {
		id: "mdi_patient",
		name: "案例一：氣喘（MDI 定量噴霧劑）",
		desc: "紅白色都保 (保養, 含ICS) + 藍色備思復 (急救, 無ICS)",
		deviceType: "MDI",
		colorShape: "紅白色・L型噴罐",
		chineseName: "都保噴霧 (Symbicort)",
		maintenanceDrug: "Symbicort Rapihaler 120 puff/btl",
		rescueDrug: "Ventolin Evohaler (藍色瓶蓋備思復)",
		dosageInstruction: "每日早晚各一次，每次按壓吸入 2 下",
		hasIcs: true,
		prepAction: "使用前請充分上下搖晃 5 秒鐘（使藥劑與推進劑均勻混合）。",
		inhaleAction: "含緊吸嘴後，按壓藥罐的『同時』，緩慢且深長吸氣 5 秒鐘。",
		deviceAdvice:
			"使用前上下充分搖晃 5 秒；含緊吸嘴，按壓藥罐同時慢深吸氣 5 秒鐘。",
		icsAdvice:
			"⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染或聲音沙啞！",
		quizQuestion: {
			q: "使用 MDI 定量噴霧吸入劑時，吸氣與按壓的正確配合方式為何？",
			options: [
				{
					id: "A",
					text: "先按壓藥罐噴出，再把嘴巴湊上去吸",
					correct: false,
				},
				{
					id: "B",
					text: "按壓藥罐的瞬間同時緩慢且深長吸氣",
					correct: true,
				},
				{
					id: "C",
					text: "快速大口吸一瞬間，不需要按壓",
					correct: false,
				},
			],
			explanation:
				"MDI 噴霧噴出速度高達時速 100 公里，若未同步慢吸，藥物會直接撞擊附著在喉嚨口腔，無法進入細支氣管！",
		},
	},
	dpi_patient: {
		id: "dpi_patient",
		name: "案例二：氣喘病患（DPI 乾粉吸入劑）",
		desc: "灰黃色易利達 (保養, 含ICS, 無急救藥)",
		deviceType: "DPI",
		colorShape: "灰黃色・扁圓盤盒",
		chineseName: "易利達 (Relvar Ellipta)",
		maintenanceDrug: "Relvar Ellipta Inhalation Powder 30 dose",
		rescueDrug: undefined,
		dosageInstruction: "每日固定時間吸入 1 次，每次 1 吸",
		hasIcs: true,
		prepAction: "向下滑開外蓋直到發出『喀』一聲（備藥完成，切勿搖晃吸入器）。",
		inhaleAction:
			"含緊吸嘴後，請『快速、深長、用力』吸氣到底（利用強吸氣氣流帶動乾粉）。",
		deviceAdvice:
			"向下滑開外蓋聽到喀一聲完成備藥；含緊吸嘴後『快速、深長、用力』吸氣到底。",
		icsAdvice:
			"⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染或聲音沙啞！",
		quizQuestion: {
			q: "使用 DPI 乾粉吸入劑（如 Ellipta 易利達）時，正確的吸氣方式為？",
			options: [
				{
					id: "A",
					text: "深、快、用力且平穩地吸氣到底",
					correct: true,
				},
				{
					id: "B",
					text: "非常緩慢輕柔地吸氣",
					correct: false,
				},
				{
					id: "C",
					text: "對著吸入器吸嘴往裡面大力吐氣",
					correct: false,
				},
			],
			explanation:
				"DPI 乾粉需要病患足夠強勁的吸氣流速才能解聚粉末並吸入肺底。絕對不能對吸嘴吹氣，否則受潮會造成乾粉結塊失效！",
		},
	},
	smi_patient: {
		id: "smi_patient",
		name: "案例三：慢性阻塞性肺病 COPD（SMI 軟霧吸入劑）",
		desc: "灰白色適倍樂 (保養, 無ICS, 無急救藥)",
		deviceType: "SMI",
		colorShape: "灰白色・圓柱長筒",
		chineseName: "適倍樂 (Spiolto Respimat)",
		maintenanceDrug: "Spiolto Respimat 60 puff",
		rescueDrug: undefined,
		dosageInstruction: "每日固定時間一次，每次旋轉掀蓋按壓 2 吸",
		hasIcs: false,
		prepAction:
			"依照『轉、開、按』口訣：旋轉透明底座半圈，掀開安全蓋至完全開啟。",
		inhaleAction:
			"按下釋放鈕的同時，緩慢、深長地吸氣（軟霧釋放長達 1.2 秒，溫和進入肺部）。",
		deviceAdvice:
			"旋轉透明底座掀開蓋子；按下按鈕同時配合微細軟霧緩慢深長吸氣。",
		icsAdvice:
			"✅ 本藥品【不含類固醇】：吸藥後不強制深部漱口，但建議仍可飲水潤喉清潔。",
		quizQuestion: {
			q: "使用 SMI 軟霧吸入劑（Respimat 適倍樂）時，吸氣與按壓釋放鈕的配合方式為？",
			options: [
				{
					id: "A",
					text: "按壓釋放鈕的同時，緩慢且深長吸氣",
					correct: true,
				},
				{
					id: "B",
					text: "按下之後憋氣 10 秒，再大口用力吸",
					correct: false,
				},
				{
					id: "C",
					text: "像抽煙一樣快速吸入一小口",
					correct: false,
				},
			],
			explanation:
				"SMI 產生的慢速微細軟霧噴出時間長達 1.2 秒，配合平穩慢深吸，可達到極高的肺部沉積率！",
		},
	},
};

/* -------------------------------------------------------------------------- */
/*                     CLINICAL DRUG CARDS (PHOTO CAROUSEL)                   */
/* -------------------------------------------------------------------------- */

export interface DrugCardItem {
	id: string;
	name: string;
	spec: string;
	deviceType: string;
	colorShape: string;
	technique: string;
	hasIcs: boolean;
	badgeColor: string;
	imageUrl: string;
	personaKey: PatientPersona;
	dosageInstruction: string;
	prepAction: string;
	inhaleAction: string;
	icsAdvice: string;
}

export const DRUG_CARDS: DrugCardItem[] = [
	{
		id: "Symbicort_Rapihaler",
		name: "都保噴霧 (Symbicort)",
		spec: "Rapihaler 120 puff",
		deviceType: "MDI 定量噴霧",
		colorShape: "🔴 紅白色・L型噴罐",
		technique: "上下搖勻・慢深吸 5 秒",
		hasIcs: true,
		badgeColor: "#2563EB",
		imageUrl: "/drugs/rapihaler.png",
		personaKey: "mdi_patient",
		dosageInstruction: "每日早晚各一次，每次按壓吸入 2 下",
		prepAction: "使用前請充分上下搖晃 5 秒鐘（使藥劑與推進劑均勻混合）。",
		inhaleAction: "含緊吸嘴後，按壓藥罐的『同時』，緩慢且深長吸氣 5 秒鐘。",
		icsAdvice:
			"⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染或聲音沙啞！",
	},
	{
		id: "Relvar_Ellipta",
		name: "易利達 (Relvar Ellipta)",
		spec: "Inhalation Powder 30 dose",
		deviceType: "DPI 乾粉吸入",
		colorShape: "🟡 灰黃色・扁圓盤盒",
		technique: "開蓋喀一聲・快深用力吸",
		hasIcs: true,
		badgeColor: "#059669",
		imageUrl: "/drugs/ellipta_real.jpg",
		personaKey: "dpi_patient",
		dosageInstruction: "每日固定時間吸入 1 次，每次 1 吸",
		prepAction: "向下滑開外蓋直到發出『喀』一聲（備藥完成，切勿搖晃吸入器）。",
		inhaleAction:
			"含緊吸嘴後，請『快速、深長、用力』吸氣到底（利用強吸氣氣流帶動乾粉）。",
		icsAdvice:
			"⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染或聲音沙啞！",
	},
	{
		id: "Spiolto_Respimat",
		name: "適倍樂 (Spiolto Respimat)",
		spec: "Respimat 60 puff",
		deviceType: "SMI 軟霧吸入",
		colorShape: "⚪ 灰白色・圓柱長筒",
		technique: "轉開按・配合軟霧慢深吸",
		hasIcs: false,
		badgeColor: "#0D9488",
		imageUrl: "/drugs/respimat_real.jpg",
		personaKey: "smi_patient",
		dosageInstruction: "每日固定時間一次，每次旋轉掀蓋按壓 2 吸",
		prepAction:
			"依照『轉、開、按』口訣：旋轉透明底座半圈，掀開安全蓋至完全開啟。",
		inhaleAction:
			"按下釋放鈕的同時，緩慢、深長地吸氣（軟霧釋放長達 1.2 秒，溫和進入肺部）。",
		icsAdvice:
			"✅ 本藥品【不含類固醇】：吸藥後不強制深部漱口，但建議仍可飲水潤喉清潔。",
	},
	{
		id: "Ventolin_Evohaler",
		name: "備思復 (Ventolin Evohaler)",
		spec: "Evohaler 200 dose",
		deviceType: "MDI 急救噴霧",
		colorShape: "🔵 藍色瓶蓋・隨身急救小噴罐",
		technique: "胸悶氣喘發作時吸 1~2 吸",
		hasIcs: false,
		badgeColor: "#0284C7",
		imageUrl: "/drugs/ventolin_real.jpg",
		personaKey: "mdi_patient",
		dosageInstruction: "急性胸悶呼吸急促時每次 1~2 吸，間隔 4 小時以上",
		prepAction: "使用前拔開藍色瓶蓋，上下搖勻 5 秒鐘。",
		inhaleAction:
			"按壓同時緩慢深吸到底，閉氣 10 秒促進藥物在支氣管放鬆平滑肌。",
		icsAdvice:
			"✅ 本藥品【不含類固醇】：為短效支氣管擴張劑，吸後無需強制漱口。",
	},
	{
		id: "Seretide_Evohaler",
		name: "續利得 (Seretide Evohaler)",
		spec: "Evohaler 120 puff",
		deviceType: "MDI 定量噴霧",
		colorShape: "🟣 紫色・L型噴罐",
		technique: "上下搖勻・慢深吸 5 秒",
		hasIcs: true,
		badgeColor: "#7E22CE",
		imageUrl: "/drugs/seretide_real.jpg",
		personaKey: "mdi_patient",
		dosageInstruction: "每日早晚各一次，每次 2 吸",
		prepAction: "取下紫色瓶蓋，垂直上下充分搖晃 5 秒鐘。",
		inhaleAction: "嘴唇緊含吸嘴，按下藥罐瞬間同步緩慢深長吸氣 5 秒鐘。",
		icsAdvice:
			"⚠️ 本藥品【含吸入型類固醇 (ICS)】：吸藥完畢後，請務必『深部漱口並吐掉』，防止口腔念珠菌感染！",
	},
	{
		id: "Ultibro_Breezhaler",
		name: "昂滋 (Ultibro Breezhaler)",
		spec: "Breezhaler 30 dose",
		deviceType: "DPI 膠囊乾粉",
		colorShape: "🟢 藍白色・膠囊雙側按鈕",
		technique: "刺孔後快深吸・有嗡嗡聲",
		hasIcs: false,
		badgeColor: "#0F766E",
		imageUrl: "/drugs/breezhaler_real.jpg",
		personaKey: "dpi_patient",
		dosageInstruction: "每日固定時間一次，每次放入 1 顆膠囊吸入",
		prepAction:
			"掀開天藍色吹嘴，放入膠囊蓋上吹嘴，同時按壓兩側深藍色按鈕刺穿膠囊一次。",
		inhaleAction:
			"口含吹嘴快速且深長吸入，會聽到膠囊在腔體內高速旋轉的『嗡嗡嗡』聲響。",
		icsAdvice: "✅ 本藥品【不含類固醇】：為雙效支氣管擴張劑，吸後免漱口。",
	},
];

/* -------------------------------------------------------------------------- */
/*                            JOURNEY STEP DEF                                */
/* -------------------------------------------------------------------------- */

export type JourneyStep =
	| "step_all"
	| "step_onboarding"
	| "step_register"
	| "step_d0"
	| "step_video"
	| "step_d3"
	| "step_d7"
	| "step_d14"
	| "step_quiz"
	| "step_d28"
	| "step_rescue";

interface StepMeta {
	id: JourneyStep;
	title: string;
	badge: string;
	qccTarget: string;
	clinicalRationale: string;
	quotaNote: string;
}

const STEP_METAS: StepMeta[] = [
	{
		id: "step_all",
		title: "🌟 完整全旅程串流",
		badge: "全流程連續滾動",
		qccTarget: "全週期 28 天臨床照護流程",
		clinicalRationale:
			"展示病患從初診領藥、好友加入、衛教排程到回診檢驗的完整歷程。",
		quotaNote: "推播(Push)僅 4 則，其餘互動(Reply) 0 則計費，完全免費！",
	},
	{
		id: "step_onboarding",
		title: "1. 迎賓與好友加入",
		badge: "Day 0 領藥後",
		qccTarget: "門診藥局 QR Code 掃描入群",
		clinicalRationale:
			"藥師交付處方吸入劑後，引導病患加入官方帳號，降低初次接觸焦慮。",
		quotaNote:
			"加入好友自動迎賓訊息（LINE 官方規定不計入 Push 額度，完全免費）。",
	},
	{
		id: "step_register",
		title: "2. 處方登記與選藥",
		badge: "實物照片指認",
		qccTarget: "自動綁定雙重標籤（裝置＋成分）",
		clinicalRationale:
			"全藥品實物圖片 Flex Carousel：病患比對藥罐外觀照片直覺指認，免文字打字與相機拍照 OCR，直覺完成雙標籤綁定。",
		quotaNote: "病患發送指令 + Bot 即時回覆（Reply 訊息，完全免費）。",
	},
	{
		id: "step_d0",
		title: "3. D0 個人化用藥卡",
		badge: "雙標籤用藥檔案",
		qccTarget: "建立正確認知與雙標籤對應",
		clinicalRationale:
			"發送標準 LINE Flex 雙重標籤用藥檔案卡，清晰列示裝置操作技巧與類固醇漱口警示。",
		quotaNote: "迎賓後接續觸發（計入免費歡迎回覆流）。",
	},
	{
		id: "step_video",
		title: "4. D0 操作示範短片",
		badge: "標準步驟短片",
		qccTarget: "視覺化正確吸入姿勢示範",
		clinicalRationale:
			"領藥當日即刻推播 5 大標準步驟影音卡片，病患點擊直接觀看複習。",
		quotaNote: "迎賓流程自動附帶發送（Reply 訊息，完全免費）。",
	},
	{
		id: "step_d3",
		title: "5. D3 使用前準備",
		badge: "第 3 天提醒",
		qccTarget: "QCC 錯誤一：未充分搖晃 (MDI)",
		clinicalRationale:
			"定量噴霧劑懸浮液沉澱分層導致劑量誤差，定期提醒搖勻 5 秒鐘。",
		quotaNote: "第 1 則主動推播（Push Count: 1）。",
	},
	{
		id: "step_d7",
		title: "6. D7 吸入前吐氣",
		badge: "第 7 天提醒",
		qccTarget: "QCC 錯誤二：未吐氣到底",
		clinicalRationale:
			"吸入前未吐空肺部殘餘氣體，會導致吸入藥物深度與肺活量不足。",
		quotaNote: "第 2 則主動推播（Push Count: 2）。",
	},
	{
		id: "step_d14",
		title: "7. D14 吸入核心技巧",
		badge: "第 14 天提醒",
		qccTarget: "QCC 錯誤三：手壓嘴吸不協調",
		clinicalRationale:
			"MDI 慢長深吸 vs DPI 快深用力。雙重標籤關鍵分流點，避免吸入失效。",
		quotaNote: "第 3 則主動推播（Push Count: 3）。",
	},
	{
		id: "step_quiz",
		title: "8. D24 技巧自我檢測",
		badge: "第 24 天測驗",
		qccTarget: "驗證病患自我照護技巧掌握度",
		clinicalRationale:
			"在 LINE 聊天室內透過 Flex 卡片出題，點擊選項立即解析，強化技巧記憶印記。",
		quotaNote: "點選選單或推播觸發，全為 Reply 互動訊息，完全免費！",
	},
	{
		id: "step_d28",
		title: "9. D28 閉氣與漱口",
		badge: "第 28 天提醒",
		qccTarget: "QCC 錯誤四：未閉氣 10 秒 / 類固醇未漱口",
		clinicalRationale:
			"閉氣促進微粒沉降；含 ICS 藥物必須漱口並吐掉，預防口腔念珠菌感染。",
		quotaNote: "第 4 則主動推播（Push Count: 4）。",
	},
	{
		id: "step_rescue",
		title: "10. 門診回診提醒",
		badge: "安全防護網",
		qccTarget: "急救藥物 Ventolin 過度使用警示",
		clinicalRationale:
			"提醒一週急救超過 2 次應回診；預約回診評估吸入劑技巧正確度。",
		quotaNote: "配合回診日程排程推播，有效管控全月額度。",
	},
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export function LineMockup() {
	const [activePersonaKey, setActivePersonaKey] =
		useState<PatientPersona>("mdi_patient");
	const [selectedDrugId, setSelectedDrugId] = useState<string>(
		"Symbicort_Rapihaler",
	);
	const [activeStep, setActiveStep] = useState<JourneyStep>("step_all");
	const [isRichMenuOpen, setIsRichMenuOpen] = useState(true);
	const [inputMode, setInputMode] = useState<"menu" | "input">("menu");
	const [quizUserAnswer, setQuizUserAnswer] = useState<string | null>(null);
	const [hasConfirmedDrug, setHasConfirmedDrug] = useState(true);
	const [hasConfirmedRescue, setHasConfirmedRescue] = useState(true);
	const [showVideoModal, setShowVideoModal] = useState(false);

	const persona = PERSONAS[activePersonaKey];
	const selectedDrug =
		DRUG_CARDS.find((d) => d.id === selectedDrugId) ?? DRUG_CARDS[0];
	const currentStepMeta =
		STEP_METAS.find((s) => s.id === activeStep) ?? STEP_METAS[0];

	// Reset state when switching persona
	function handlePersonaChange(newPersona: PatientPersona) {
		setActivePersonaKey(newPersona);
		setQuizUserAnswer(null);
		setHasConfirmedDrug(true);
		setHasConfirmedRescue(true);
		const defaultDrug = DRUG_CARDS.find((d) => d.personaKey === newPersona);
		if (defaultDrug) {
			setSelectedDrugId(defaultDrug.id);
		}
	}

	// Rich Menu click handler simulates conversation in bot
	function handleRichMenuAction(action: RichMenuAction) {
		if (action === "my_drug") {
			setActiveStep("step_d0");
		} else if (action === "video") {
			setActiveStep("step_video");
		} else if (action === "quiz") {
			setActiveStep("step_quiz");
		} else if (action === "visit_reminder") {
			setActiveStep("step_rescue");
		} else if (action === "faq") {
			setActiveStep("step_d28");
		} else if (action === "contact_pharmacist") {
			setActiveStep("step_rescue");
		}
	}

	return (
		<div className="min-h-screen bg-[#edf0f5] text-slate-900">
			{/* Top Bar for Pharmacist Review */}
			<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-3.5 backdrop-blur-md shadow-xs">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
							<ShieldCheck className="h-6 w-6" />
						</div>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-lg font-bold text-slate-900">
									LINE 智慧吸入劑衛教系統 — 藥師臨床審閱展示台
								</h1>
								<span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
									臺大雲林分院藥劑部專用
								</span>
							</div>
							<p className="text-xs text-slate-500">
								100% 依循 LINE Messaging API Flex Message 規範 • 原生對話式互動
								• 直覺實物辨識
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="text-right">
							<p className="text-xs font-semibold text-slate-500">
								推播額度預算精算
							</p>
							<p className="text-sm font-bold text-emerald-700">
								4 則 Push / 人 • 互動 0 元（符合 200 則免費層）
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* Main Workspace: 2-column layout */}
			<main className="mx-auto max-w-7xl p-6">
				<div className="grid gap-8 lg:grid-cols-[430px_minmax(0,1fr)]">
					{/* ========================================================================= */}
					{/* LEFT COLUMN: Photorealistic LINE Phone Frame                              */}
					{/* ========================================================================= */}
					<div className="flex flex-col items-center">
						<div className="mb-2 flex w-full items-center justify-between px-2">
							<span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
								<span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
								真實病患手機視角 (Pixel-Perfect LINE Mobile)
							</span>
							<button
								type="button"
								onClick={() => {
									setQuizUserAnswer(null);
									setHasConfirmedDrug(true);
									setHasConfirmedRescue(true);
									setActiveStep("step_all");
								}}
								className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-700 font-medium"
							>
								<RotateCcw className="h-3.5 w-3.5" />
								重設展示狀態
							</button>
						</div>

						{/* Realistic iPhone 16 Pro Frame */}
						<div className="relative w-[390px] overflow-hidden rounded-[52px] border-[10px] border-[#1f2429] bg-[#849ebf] shadow-2xl ring-1 ring-black/10">
							{/* Hardware Buttons Decoration on Frame */}
							<div className="pointer-events-none absolute -left-[13px] top-[115px] h-10 w-[4px] rounded-l-sm bg-slate-700" />
							<div className="pointer-events-none absolute -left-[13px] top-[165px] h-12 w-[4px] rounded-l-sm bg-slate-700" />
							<div className="pointer-events-none absolute -right-[13px] top-[135px] h-16 w-[4px] rounded-r-sm bg-slate-700" />

							{/* iOS Status Bar */}
							<div className="relative z-20 flex h-11 items-center justify-between bg-white px-7 text-[12px] font-semibold text-slate-900 select-none">
								<span>09:41</span>
								{/* Dynamic Island */}
								<div className="h-5 w-24 rounded-full bg-black mx-auto" />
								<div className="flex items-center gap-1.5 text-slate-900">
									<span className="text-[10px]">5G</span>
									<span className="text-[11px]">▮▮▮</span>
									{/* Battery Icon */}
									<div className="flex h-3 w-5 items-center rounded-xs border border-slate-900 px-[1px]">
										<div className="h-2 w-3 bg-slate-900 rounded-[1px]" />
									</div>
								</div>
							</div>

							{/* Authentic LINE Navigation Header */}
							<div className="relative z-20 flex items-center justify-between border-b border-slate-200/80 bg-white px-3.5 py-2.5 shadow-xs select-none">
								<div className="flex items-center gap-1 text-slate-800">
									<span className="text-2xl leading-none font-light cursor-pointer">
										‹
									</span>
									<span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
										99+
									</span>
								</div>

								{/* Official Account Title & Verified Shield */}
								<div className="flex items-center gap-1.5">
									{/* Hospital Circular Logo Badge */}
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-xs">
										臺大
									</div>
									<div className="text-center">
										<div className="flex items-center gap-1">
											<p className="text-[13px] font-bold text-slate-900 leading-tight">
												臺大雲林 智慧吸入劑衛教
											</p>
											{/* Real Green Verified Badge */}
											<span
												title="LINE 官方認證綠盾牌"
												className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#06c755] text-white text-[8px] font-black"
											>
												✓
											</span>
										</div>
										<p className="text-[9px] text-slate-400">
											雲林分院藥劑部官方帳號
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2 text-slate-700">
									<Search className="h-4 w-4 cursor-pointer" />
									<Volume2 className="h-4 w-4 cursor-pointer" />
									<Menu className="h-4 w-4 cursor-pointer" />
								</div>
							</div>

							{/* Chat Area with Authentic LINE Blue Background */}
							<div className="h-[490px] overflow-y-auto line-chat-area no-scrollbar px-3.5 py-4 space-y-4 text-[13px]">
								{/* ---------------- DAY 0: ONBOARDING, REGISTRATION & VIDEO ---------------- */}
								{(activeStep === "step_all" ||
									activeStep === "step_onboarding" ||
									activeStep === "step_register" ||
									activeStep === "step_d0" ||
									activeStep === "step_video") && (
									<DateDivider label="2026年10月19日 星期一（領藥當日）" />
								)}

								{/* 1. ONBOARDING / WELCOME (REAL FLEX BUBBLE) */}
								{(activeStep === "step_all" ||
									activeStep === "step_onboarding") && (
									<div className="space-y-3">
										<div className="flex items-start gap-2 select-text">
											<BotAvatar />
											<div className="max-w-[88%] space-y-1">
												<BotSenderName />
												{/* Authentic LINE Flex Bubble for Welcome via Simulator Harness */}
												<FlexHarness
													json={createWelcomeFlexBubble()}
													onAction={(action) => {
														if (action.data === "action=start_register") {
															setActiveStep("step_register");
														} else if (action.data === "action=view_faq") {
															setActiveStep("step_d28");
														}
													}}
												/>
												<span className="text-[10px] text-white/80 pl-1 block">
													09:30
												</span>
											</div>
										</div>
									</div>
								)}

								{/* 2. IN-CHAT REGISTRATION & PHOTO CAROUSEL */}
								{(activeStep === "step_all" ||
									activeStep === "step_register") && (
									<div className="space-y-3">
										<div className="flex items-start gap-2 select-text">
											<BotAvatar />
											<div className="max-w-[88%] space-y-1">
												<BotSenderName />
												<div className="rounded-2xl bg-white px-3.5 py-2.5 text-slate-800 shadow-xs border border-slate-200/80">
													<p className="text-[13px] text-slate-800 leading-relaxed">
														請比對下方照片，點選您目前使用的吸入劑：
													</p>
												</div>
												<span className="text-[10px] text-white/80 pl-1 block">
													09:31
												</span>
											</div>
										</div>

										{/* Authentic LINE Flex Carousel via Simulator Harness */}
										<div className="pl-11">
											<FlexHarness
												json={createDrugSelectCarousel(
													DRUG_CARDS.map((card) => ({
														id: card.id,
														name: card.name,
														spec: card.spec,
														deviceType: card.deviceType,
														colorShape: card.colorShape,
														technique: card.technique,
														hasIcs: card.hasIcs,
														color: card.badgeColor,
														imageUrl: card.imageUrl,
													})),
												)}
												onAction={(action) => {
													if (action.data?.startsWith("action=select_drug")) {
														const params = new URLSearchParams(action.data);
														const drugId = params.get("drug");
														const card = DRUG_CARDS.find(
															(c) => c.id === drugId,
														);
														if (card) {
															setSelectedDrugId(card.id);
															setActivePersonaKey(card.personaKey);
															setHasConfirmedDrug(true);
														}
													}
												}}
											/>
										</div>

										{/* Outgoing Patient Confirmation Message */}
										{hasConfirmedDrug && (
											<PatientMessage
												time="09:31"
												text={`我用的是這瓶：${selectedDrug.colorShape}【${selectedDrug.name}】`}
											/>
										)}

										{/* Step 2.5: 急救備用藥確認 */}
										{hasConfirmedDrug && (
											<div className="space-y-3 pt-1">
												<div className="flex items-start gap-2 select-text">
													<BotAvatar />
													<div className="max-w-[88%] space-y-1">
														<BotSenderName />
														{/* Authentic Rescue Prompt Flex Bubble via Simulator Harness */}
														<FlexHarness
															json={createRescuePromptBubble(
																selectedDrug.name,
																selectedDrug.colorShape,
															)}
															onAction={(action) => {
																const params = new URLSearchParams(action.data);
																const hasRescue =
																	params.get("has_rescue") === "true";
																setHasConfirmedRescue(hasRescue);
															}}
														/>
														<span className="text-[10px] text-white/80 pl-1 block">
															09:32
														</span>
													</div>
												</div>

												{/* Outgoing Patient Rescue Response */}
												<PatientMessage
													time="09:32"
													text={
														hasConfirmedRescue
															? "我有開立藍色瓶蓋 Ventolin (備思復) 急救藥"
															: "沒有，我只有日常保養吸入劑"
													}
												/>
											</div>
										)}
									</div>
								)}

								{/* 3. D0 DUAL-TAG PROFILE CARD */}
								{(activeStep === "step_all" || activeStep === "step_d0") && (
									<div className="space-y-3">
										<div className="flex items-start gap-2 select-text">
											<BotAvatar />
											<div className="max-w-[88%] space-y-1">
												<BotSenderName />

												{/* Official LINE Flex Message Bubble: Dual Tag Profile via Simulator Harness */}
												<FlexHarness
													json={createDualTagProfileBubble({
														drugName: `【${persona.colorShape}】${persona.chineseName}`,
														deviceType: persona.deviceType,
														hasIcs: persona.hasIcs,
														hasRescue: hasConfirmedRescue,
														deviceAdvice: persona.deviceAdvice,
														icsAdvice: persona.icsAdvice,
													})}
													onAction={(action) => {
														if (action.data === "action=view_video") {
															setShowVideoModal(true);
														} else if (action.data === "action=take_quiz") {
															setActiveStep("step_quiz");
														}
													}}
												/>

												<span className="text-[10px] text-white/80 pl-1 block">
													09:33
												</span>
											</div>
										</div>
									</div>
								)}

								{/* 4. D0 操作示範短片（領藥當日即刻推播，解決初次用藥焦慮） */}
								{(activeStep === "step_all" || activeStep === "step_video") && (
									<div className="space-y-3">
										<div className="flex items-start gap-2 select-text">
											<BotAvatar />
											<div className="max-w-[88%] space-y-1">
												<BotSenderName />

												{/* Authentic LINE Flex Bubble: Video Guide */}
												<FlexHarness
													json={createVideoBubble({
														deviceType: persona.deviceType,
														stepText: persona.deviceAdvice,
														youtubeUrl:
															"https://www.youtube.com/watch?v=dQw4w9WgXcQ",
													})}
													onAction={() => setShowVideoModal(true)}
												/>

												<span className="text-[10px] text-white/80 pl-1 block">
													09:34
												</span>
											</div>
										</div>
									</div>
								)}

								{/* ---------------- DAY 3: PREPARATION PUSH ---------------- */}
								{(activeStep === "step_all" || activeStep === "step_d3") && (
									<>
										<DateDivider label="2026年10月22日 星期四（領藥第 3 天）" />
										<div className="space-y-3">
											<BotMessage
												time="09:00"
												content={`【InhaSync™ Day 3 使用前準備】\n\n📌 本次臨床重點：使用前準備\n${persona.prepAction}\n\n💡 藥師提醒：每次吸入前確實做好準備動作，能確保藥物劑量穩定且充足！`}
											/>
										</div>
									</>
								)}

								{/* ---------------- DAY 7: EXHALE BEFORE INHALING ---------------- */}
								{(activeStep === "step_all" || activeStep === "step_d7") && (
									<>
										<DateDivider label="2026年10月26日 星期一（領藥第 7 天）" />
										<div className="space-y-3">
											<BotMessage
												time="09:00"
												content={`【InhaSync™ Day 7 吸入前先吐氣】\n\n📌 本次臨床重點：吸入前先將氣吐到底\n吸入藥物前，請遠離吸嘴，輕鬆緩慢地將肺部氣體吐出（吐氣到底）。\n\n💡 藥師提醒：先吐空肺部殘留氣體，才能騰出最大肺活量空間，將深層微粒完全吸入肺底！`}
											/>
										</div>
									</>
								)}

								{/* ---------------- DAY 14: INHALE TECHNIQUE ---------------- */}
								{(activeStep === "step_all" || activeStep === "step_d14") && (
									<>
										<DateDivider label="2026年11月02日 星期一（領藥第 14 天）" />
										<div className="space-y-3">
											<BotMessage
												time="09:00"
												content={`【InhaSync™ Day 14 吸入核心技巧】\n\n📌 本次臨床重點：${persona.deviceType} 吸入要訣\n${persona.inhaleAction}\n\n💡 雙重標籤分流提醒：不同吸入器裝置吸氣速度完全不同，切勿弄混！`}
											/>
										</div>
									</>
								)}

								{/* ---------------- DAY 24: IN-CHAT QUIZ (FLEX BUBBLE SPEC) ---------------- */}
								{(activeStep === "step_all" || activeStep === "step_quiz") && (
									<>
										<DateDivider label="2026年11月12日 星期四（領藥第 24 天 技巧自我檢測）" />
										<div className="space-y-3">
											<div className="flex items-start gap-2 select-text">
												<BotAvatar />
												<div className="max-w-[88%] space-y-1">
													<BotSenderName />

													{/* Official Quiz Flex Card via Simulator Harness */}
													<FlexHarness
														json={createQuizBubble({
															question: persona.quizQuestion.q,
															options: persona.quizQuestion.options.map(
																(opt) => ({
																	id: opt.id,
																	text: opt.text,
																}),
															),
														})}
														onAction={(action) => {
															if (
																action.data?.startsWith("action=answer_quiz")
															) {
																const params = new URLSearchParams(action.data);
																const ans = params.get("answer");
																if (ans) setQuizUserAnswer(ans);
															}
														}}
													/>
													<span className="text-[10px] text-white/80 pl-1 block">
														10:00
													</span>
												</div>
											</div>

											{/* Patient Answer Message */}
											{quizUserAnswer && (
												<>
													<PatientMessage
														time="10:01"
														text={`我選擇 (${quizUserAnswer}) ${
															persona.quizQuestion.options.find(
																(o) => o.id === quizUserAnswer,
															)?.text
														}`}
													/>

													{/* Bot's Official Quiz Feedback Flex Bubble via Simulator Harness */}
													<div className="flex items-start gap-2 select-text">
														<BotAvatar />
														<div className="max-w-[88%] space-y-1">
															<BotSenderName />
															<FlexHarness
																json={createQuizFeedbackBubble({
																	isCorrect:
																		!!persona.quizQuestion.options.find(
																			(o) => o.id === quizUserAnswer,
																		)?.correct,
																	explanation: persona.quizQuestion.explanation,
																})}
															/>
															<div className="pt-1">
																<button
																	type="button"
																	onClick={() => setShowVideoModal(true)}
																	className="w-full rounded-xl bg-teal-600 py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-1.5"
																>
																	<Play className="h-3.5 w-3.5 fill-current" />
																	觀看示範短片複習技巧
																</button>
															</div>
															<span className="text-[10px] text-white/80 pl-1 block">
																10:01
															</span>
														</div>
													</div>
												</>
											)}
										</div>
									</>
								)}

								{/* ---------------- DAY 28: BREATH-HOLD & RINSE ---------------- */}
								{(activeStep === "step_all" || activeStep === "step_d28") && (
									<>
										<DateDivider label="2026年11月16日 星期一（領藥第 28 天）" />
										<div className="space-y-3">
											<BotMessage
												time="09:00"
												content={`【InhaSync™ Day 28 吸後確認與漱口】\n\n📌 本次臨床重點：閉氣 10 秒與漱口\n吸入藥物後，請緊閉嘴巴屏住呼吸約 10 秒（或默數 10 下），讓藥物微粒充分沉降。\n${
													persona.hasIcs
														? "\n⚠️ 此藥物含吸入型類固醇（ICS），使用後請務必以清水深部漱口 2~3 次並將水吐掉，預防聲音沙啞與口腔念珠菌感染！"
														: "\n✅ 本藥物不含類固醇，吸入後建議飲水潤喉清潔即可。"
												}`}
											/>
										</div>
									</>
								)}

								{/* ---------------- CLINIC VISIT REMINDER ---------------- */}
								{(activeStep === "step_all" ||
									activeStep === "step_rescue") && (
									<>
										<DateDivider label="2026年11月20日 星期五（門診回診提醒）" />
										<div className="space-y-3">
											<BotMessage
												time="14:00"
												content={`【InhaSync™ 門診回診提醒】\n\n親愛的病友您好，您預計於下週回診。\n\n回診時請記得隨身攜帶您的【${persona.chineseName}】與急救藥物，至門診藥局由藥師為您再次檢測吸入技巧！\n\n🚨 用藥安全小守則：若一週使用急救藥物（Ventolin）超過 2 次，表示氣喘控制可能不穩定，回診時請主動告訴醫師！`}
											/>
										</div>
									</>
								)}
							</div>

							{/* Bottom Section: Rich Menu or Input Bar */}
							{inputMode === "menu" ? (
								<RichMenu
									isMenuOpen={isRichMenuOpen}
									onToggleMenu={() => setIsRichMenuOpen(!isRichMenuOpen)}
									onSelect={handleRichMenuAction}
								/>
							) : (
								<div className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2">
									<button
										type="button"
										className="text-xl text-slate-600 hover:text-slate-800"
									>
										＋
									</button>
									<input
										type="text"
										readOnly
										value="與藥師對話中（文字諮詢）..."
										className="flex-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-[12px] text-slate-500 focus:outline-hidden"
									/>
									<span className="text-base text-slate-500">☺</span>
									<span className="text-base text-slate-500">🎤</span>
								</div>
							)}

							{/* Home Indicator Bar */}
							<div className="flex justify-center bg-white pb-2 pt-1">
								<div className="h-1 w-32 rounded-full bg-slate-300" />
							</div>

							{/* Simulated Video Playback Modal Overlay */}
							{showVideoModal && (
								<div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-sm p-4">
									<div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
										<div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
											<div className="flex items-center gap-2">
												<Play className="h-4 w-4 text-emerald-400 fill-current" />
												<span className="text-[13px] font-bold">
													{persona.deviceType} 標準吸入技巧示範 (2:15)
												</span>
											</div>
											<button
												type="button"
												onClick={() => setShowVideoModal(false)}
												className="rounded-full p-1 text-slate-400 hover:text-white"
											>
												<X className="h-4 w-4" />
											</button>
										</div>

										<div className="aspect-video bg-slate-950 flex flex-col items-center justify-center text-center p-6 text-white">
											<div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/40">
												<Play className="h-7 w-7 ml-0.5 fill-current" />
											</div>
											<p className="font-bold text-[14px]">
												【{persona.chineseName} 臨床操作示範】
											</p>
											<p className="text-[12px] text-slate-300 mt-1 max-w-[280px]">
												{persona.prepAction}
											</p>
											<p className="text-[11px] text-emerald-400 mt-2 font-semibold">
												{persona.inhaleAction}
											</p>
										</div>

										<div className="p-3.5 bg-slate-50 flex items-center justify-between border-t border-slate-200">
											<span className="text-[11px] text-slate-500">
												臺大雲林分院藥劑部 衛教影音中心
											</span>
											<button
												type="button"
												onClick={() => setShowVideoModal(false)}
												className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-emerald-700"
											>
												關閉影片
											</button>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Toggle Bottom Phone Control (Menu vs Text Input) */}
						<div className="mt-3 flex gap-2">
							<button
								type="button"
								onClick={() => setInputMode("menu")}
								className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
									inputMode === "menu"
										? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
										: "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
								}`}
							>
								📱 圖文選單模式（預設）
							</button>
							<button
								type="button"
								onClick={() => setInputMode("input")}
								className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
									inputMode === "input"
										? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
										: "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
								}`}
							>
								💬 鍵盤輸入列模式
							</button>
						</div>
					</div>

					{/* ========================================================================= */}
					{/* RIGHT COLUMN: Pharmacist Discussion Cockpit & Clinical Notes               */}
					{/* ========================================================================= */}
					<div className="space-y-6">
						{/* 1. Clinical Drug Selector & Photo Carousel Inspector */}
						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
									<span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
										1
									</span>
									臨床 6 款吸入劑實物圖片快速切換（KISS 原則）
								</h2>
								<span className="text-xs text-slate-500">
									點選即時切換手機指認結果
								</span>
							</div>

							<p className="text-xs text-slate-600 mb-3 leading-relaxed">
								直接在原生 LINE 聊天室透過{" "}
								<strong>Flex Carousel 實物圖輪播</strong>{" "}
								讓長輩依手邊藥罐指認，免文字打字、免相機拍照
								OCR、無條碼對焦障礙：
							</p>

							<div className="grid gap-2.5 sm:grid-cols-3">
								{DRUG_CARDS.map((card) => {
									const isSelected = selectedDrugId === card.id;
									return (
										<button
											key={card.id}
											type="button"
											onClick={() => {
												setSelectedDrugId(card.id);
												setActivePersonaKey(card.personaKey);
												setHasConfirmedDrug(true);
											}}
											className={`rounded-xl border p-3 text-left transition-all flex flex-col justify-between ${
												isSelected
													? "border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500"
													: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
											}`}
										>
											<div>
												<div className="flex items-center justify-between">
													<span
														className="font-bold text-[11px]"
														style={{ color: card.badgeColor }}
													>
														{card.deviceType}
													</span>
													{isSelected && (
														<span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
															✓
														</span>
													)}
												</div>
												<p className="mt-1 text-[12.5px] font-bold text-slate-900 line-clamp-1">
													{card.name}
												</p>
												<p className="mt-0.5 text-[10px] text-slate-500">
													{card.colorShape}
												</p>
											</div>
											<div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
												<span
													className={
														card.hasIcs
															? "text-rose-600 font-bold"
															: "text-emerald-700 font-medium"
													}
												>
													{card.hasIcs ? "含類固醇(漱口)" : "無類固醇"}
												</span>
												<span className="text-slate-400 font-mono">
													{card.spec.split(" ")[0]}
												</span>
											</div>
										</button>
									);
								})}
							</div>

							{/* Clinical Rationale Callout */}
							<div className="mt-4 rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-xs text-blue-900 space-y-1.5">
								<div className="font-bold flex items-center gap-1.5 text-blue-950">
									<CheckCircle2 className="h-4 w-4 text-blue-600" />
									藥師審閱重點：全齡通用實物輪播指認 (Photo Carousel)
								</div>
								<p className="text-[11.5px] leading-relaxed text-blue-800">
									多數病患（包含初次確診者與長者）不熟悉醫學學名（如
									Budesonide/Formoterol），但對自己手邊藥罐的
									<strong>『外觀顏色與形狀』</strong>印象極為深刻。透過 LINE
									原生輪播卡片（附真實照片、操作口訣與類固醇警示），病患滑動 3
									秒即可完成指認，且 100% 採用 Webhook Reply
									免費回覆，符合零預算超支原則！
								</p>
							</div>
						</section>

						{/* 2. Journey Stepper (Review Flow Navigator) */}
						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
									<span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
										2
									</span>
									衛教推播節點導覽（點選檢視單一觸發畫面）
								</h2>
								<span className="text-xs font-semibold text-emerald-700">
									當前步驟：{currentStepMeta.title}
								</span>
							</div>

							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
								{STEP_METAS.map((step) => {
									const isActive = activeStep === step.id;
									return (
										<button
											key={step.id}
											type="button"
											onClick={() => setActiveStep(step.id)}
											className={`rounded-lg border px-3 py-2 text-left text-xs transition-all ${
												isActive
													? "border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs"
													: "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
											}`}
										>
											<p className="truncate">{step.title}</p>
											<span
												className={`text-[10px] ${
													isActive ? "text-emerald-100" : "text-slate-400"
												}`}
											>
												{step.badge}
											</span>
										</button>
									);
								})}
							</div>
						</section>

						{/* 3. Clinical & QCC Target Card */}
						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
							<div className="flex items-center justify-between border-b border-slate-100 pb-3">
								<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
									<Info className="h-4 w-4 text-emerald-600" />
									當前步驟之臨床指引與 QCC 改善對策
								</h3>
								<span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-medium">
									{currentStepMeta.qccTarget}
								</span>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
									<p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
										胸腔醫學會標準指引依據
									</p>
									<p className="mt-1 text-xs text-slate-700 leading-relaxed">
										{currentStepMeta.clinicalRationale}
									</p>
								</div>

								<div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-200">
									<p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
										LINE 台灣推播額度計算
									</p>
									<p className="mt-1 text-xs text-emerald-900 leading-relaxed font-medium">
										{currentStepMeta.quotaNote}
									</p>
								</div>
							</div>
						</section>

						{/* 4. Pharmacist Decision & Discussion Checklist */}
						<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
							<div className="flex items-center justify-between mb-3.5">
								<h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
									<CheckCircle2 className="h-4 w-4 text-emerald-600" />
									藥師專案會議待確認清單（Checklist for Alignment）
								</h3>
								<span className="text-xs text-slate-400">
									可逐項與藥師確認定案
								</span>
							</div>

							<div className="space-y-2.5 text-xs">
								<div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
									<input
										type="checkbox"
										id="chk0"
										defaultChecked
										className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
									/>
									<label
										htmlFor="chk0"
										className="text-slate-800 leading-relaxed"
									>
										<strong>【全齡通用直覺指認】：</strong>
										多數病患不熟悉「MDI/DPI/SMI」英文代號或醫學學名。系統全面落實
										<strong>
											「外觀顏色（紅白色/灰黃色/灰白色）＋形狀口訣」
										</strong>
										與實物照片指認，徹底消除使用門檻。
									</label>
								</div>

								<div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
									<input
										type="checkbox"
										id="chk1"
										defaultChecked
										className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
									/>
									<label
										htmlFor="chk1"
										className="text-slate-700 leading-relaxed"
									>
										<strong>【100% LINE Flex 規範真實性】：</strong>
										放棄任何網頁單選打勾按鈕假樣式，完全依據 LINE Messaging API
										規範，使用 Postback/Message 觸發標準對話卡片與輪播。
									</label>
								</div>

								<div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
									<input
										type="checkbox"
										id="chk2"
										defaultChecked
										className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
									/>
									<label
										htmlFor="chk2"
										className="text-slate-700 leading-relaxed"
									>
										<strong>【隨堂測驗互動整合】：</strong>
										確認於 Day 24
										透過機器人直接出題，病患點選按鈕後立即在聊天室獲得臨床解析，加深記憶。
									</label>
								</div>

								<div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
									<input
										type="checkbox"
										id="chk3"
										defaultChecked
										className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
									/>
									<label
										htmlFor="chk3"
										className="text-slate-700 leading-relaxed"
									>
										<strong>【推播成本控制】：</strong>
										全月 28 天維持 4 則主動 Push 推播（D3/D7/D14/D28），50
										人次共消耗 200 則，完全落在 LINE 免費配額之內。
									</label>
								</div>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                            SUBCOMPONENTS                                   */
/* -------------------------------------------------------------------------- */

function BotAvatar() {
	return (
		<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-[11px] shadow-xs select-none">
			臺大
		</div>
	);
}

function BotSenderName() {
	return (
		<p className="text-[10px] text-white/90 font-medium pl-0.5">
			臺大醫院雲林分院 藥劑部
		</p>
	);
}

function BotMessage({ content, time }: { content: string; time: string }) {
	return (
		<div className="flex items-start gap-2 select-text">
			<BotAvatar />
			<div className="max-w-[85%] space-y-1">
				<BotSenderName />
				<div className="rounded-2xl rounded-tl-xs bg-white px-3.5 py-2.5 text-slate-800 shadow-sm leading-relaxed whitespace-pre-line text-[12.5px]">
					{content}
				</div>
				<span className="text-[10px] text-white/80 pl-1 block">{time}</span>
			</div>
		</div>
	);
}

function PatientMessage({ text, time }: { text: string; time: string }) {
	return (
		<div className="flex justify-end items-end gap-1.5 select-text">
			<div className="flex flex-col items-end text-[10px] text-white/80 pb-0.5">
				<span>已讀</span>
				<span>{time}</span>
			</div>
			<div className="max-w-[78%] rounded-2xl rounded-tr-xs bg-[#06c755] px-3.5 py-2 text-white shadow-sm leading-relaxed text-[12.5px] font-medium">
				{text}
			</div>
		</div>
	);
}

function DateDivider({ label }: { label: string }) {
	return (
		<div className="flex justify-center my-3 select-none">
			<span className="rounded-full bg-black/25 px-3 py-0.5 text-[11px] font-medium text-white/95 shadow-xs">
				{label}
			</span>
		</div>
	);
}
