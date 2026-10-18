/**
 * Photorealistic LINE Official Account Rich Menu (圖文選單).
 *
 * Implements the standard 6-grid layout (2500 x 1686 px ratio) used by
 * medical institutions in Taiwan:
 *   [ 💊 我的吸入劑 ] [ 🎬 操作影片 ] [ 📝 隨堂測驗 ]
 *   [ 📅 回診提醒   ] [ ❓ 常見問答 ] [ 👩‍⚕️ 諮詢藥師 ]
 *
 * Designed with medical-grade clarity, high contrast for elderly patients,
 * and realistic LINE Official Account styling.
 */

import {
	CalendarClock,
	FileQuestion,
	HelpCircle,
	Pill,
	UserRound,
	Video,
} from "lucide-react";

export type RichMenuAction =
	| "my_drug"
	| "video"
	| "quiz"
	| "visit_reminder"
	| "faq"
	| "contact_pharmacist";

export interface RichMenuItem {
	id: RichMenuAction;
	label: string;
	sublabel: string;
	icon: typeof Pill;
	color: string;
	bgColor: string;
	borderColor: string;
	badge?: string;
}

export const RICH_MENU_ITEMS: RichMenuItem[] = [
	{
		id: "my_drug",
		label: "我的吸入劑",
		sublabel: "藥物指南與雙標籤",
		icon: Pill,
		color: "text-emerald-700",
		bgColor: "bg-emerald-50 hover:bg-emerald-100",
		borderColor: "border-emerald-200",
		badge: "雙標籤",
	},
	{
		id: "video",
		label: "操作示範影片",
		sublabel: "2分鐘標準示範",
		icon: Video,
		color: "text-blue-700",
		bgColor: "bg-blue-50 hover:bg-blue-100",
		borderColor: "border-blue-200",
		badge: "精華",
	},
	{
		id: "quiz",
		label: "隨堂小測驗",
		sublabel: "複習操作技巧",
		icon: FileQuestion,
		color: "text-amber-700",
		bgColor: "bg-amber-50 hover:bg-amber-100",
		borderColor: "border-amber-200",
		badge: "互動",
	},
	{
		id: "visit_reminder",
		label: "門診回診提醒",
		sublabel: "定期追蹤評估",
		icon: CalendarClock,
		color: "text-purple-700",
		bgColor: "bg-purple-50 hover:bg-purple-100",
		borderColor: "border-purple-200",
	},
	{
		id: "faq",
		label: "用藥疑難 Q&A",
		sublabel: "漱口/清洗/漏用",
		icon: HelpCircle,
		color: "text-rose-700",
		bgColor: "bg-rose-50 hover:bg-rose-100",
		borderColor: "border-rose-200",
	},
	{
		id: "contact_pharmacist",
		label: "諮詢雲林藥師",
		sublabel: "門診藥局專線",
		icon: UserRound,
		color: "text-teal-700",
		bgColor: "bg-teal-50 hover:bg-teal-100",
		borderColor: "border-teal-200",
	},
];

export function RichMenu({
	onSelect,
	isMenuOpen,
	onToggleMenu,
}: {
	onSelect: (action: RichMenuAction) => void;
	isMenuOpen: boolean;
	onToggleMenu: () => void;
}) {
	return (
		<div className="w-full bg-white select-none">
			{/* Menu content container */}
			{isMenuOpen && (
				<div className="grid grid-cols-3 grid-rows-2 border-t border-slate-200 bg-slate-50">
					{RICH_MENU_ITEMS.map((item, index) => {
						const Icon = item.icon;
						const isRightCol = (index + 1) % 3 === 0;
						const isBottomRow = index >= 3;

						return (
							<button
								key={item.id}
								type="button"
								onClick={() => onSelect(item.id)}
								className={`relative flex flex-col items-center justify-center p-3 text-center transition-all active:scale-[0.98] ${
									item.bgColor
								} ${!isRightCol ? "border-r border-slate-200" : ""} ${
									!isBottomRow ? "border-b border-slate-200" : ""
								}`}
							>
								{item.badge && (
									<span className="absolute top-1.5 right-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
										{item.badge}
									</span>
								)}
								<div
									className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-xs ${item.color}`}
								>
									<Icon className="h-5 w-5" />
								</div>
								<span className="text-[12px] font-bold text-slate-800 leading-tight">
									{item.label}
								</span>
								<span className="text-[9px] text-slate-500 mt-0.5">
									{item.sublabel}
								</span>
							</button>
						);
					})}
				</div>
			)}

			{/* Authentic LINE bottom toggle bar */}
			<button
				type="button"
				onClick={onToggleMenu}
				className="flex w-full items-center justify-center gap-1.5 border-t border-slate-200 bg-[#f7f8f9] py-2 text-[11px] font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200"
			>
				<span>{isMenuOpen ? "▼ 隱藏圖文選單" : "▲ 開啟圖文選單"}</span>
			</button>
		</div>
	);
}
