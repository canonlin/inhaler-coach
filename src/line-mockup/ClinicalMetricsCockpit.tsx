/**
 * Clinical Metrics & Scene Division Cockpit for NTUH Yunlin Pharmacy Review.
 *
 * PURPOSE:
 * Specialized clinical decision & alignment module presented to the Department
 * of Pharmacy at NTU Hospital Yunlin Branch (臺大醫院雲林分院藥劑部).
 *
 * CORE ARCHITECTURAL PRINCIPLE:
 * 1. 診間 AI 鏡頭衛教 (In-Clinic AI Coach)：只在診間/衛教諮詢室！負責「客觀物理動作量測」
 *    與「自動預填核檢表（省去藥師 8 次手動點擊）」，絕不要求長輩在家架手機對鏡頭操作。
 * 2. 居家 LINE 官方帳號 (At-Home LINE Bot)：病患日常手機隨身。負責「認知鞏固、影片複習、
 *    隨堂小測驗、回診提醒」，零科技門檻、零相機操作。
 * 3. 門診藥師評估 (In-Clinic Pharmacist)：掌控醫療責任黃金標準，一鍵覆核 AI 數據並評核
 *    QCC 附件七 33 步驟，產出 M0 初評 vs. M1 複評成效報告。
 */

import {
	Activity,
	AlertCircle,
	ArrowRight,
	BarChart3,
	CalendarClock,
	CheckCircle2,
	ClipboardCheck,
	Database,
	FileQuestion,
	Hospital,
	Info,
	Layers,
	ShieldCheck,
	Smartphone,
	Sparkles,
	Stethoscope,
	Users,
	Video,
	Workflow,
} from "lucide-react";
import { useState } from "react";

export function ClinicalMetricsCockpit() {
	const [activeTab, setActiveTab] = useState<"flow" | "matrix" | "checklist">(
		"flow",
	);

	return (
		<section className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/40 via-white to-blue-50/30 p-5 shadow-sm">
			{/* Header with Clinical Badge */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-3.5 mb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
							<Workflow className="h-4 w-4" />
						</span>
						<h2 className="text-base font-bold text-slate-900 tracking-tight">
							【藥師會議討論焦點】QCC 成效指標收集與三大場景權責分工
						</h2>
					</div>
					<p className="mt-1 text-xs text-slate-600">
						精確定位：
						<strong className="text-emerald-800">診間 AI 衛教</strong>（動作客觀量化）×{" "}
						<strong className="text-blue-800">居家 LINE 衛教</strong>（觀念與依從度維持）×{" "}
						<strong className="text-purple-800">門診藥師評估</strong>（QCC 附件七黃金標準）
					</p>
				</div>

				{/* Tab Switches */}
				<div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold select-none">
					<button
						type="button"
						onClick={() => setActiveTab("flow")}
						className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
							activeTab === "flow"
								? "bg-white text-emerald-800 shadow-xs font-bold"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<Layers className="h-3.5 w-3.5" />
						場景分工與資料流
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("matrix")}
						className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
							activeTab === "matrix"
								? "bg-white text-blue-800 shadow-xs font-bold"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<BarChart3 className="h-3.5 w-3.5" />
						指標收集權責矩陣
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("checklist")}
						className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all ${
							activeTab === "checklist"
								? "bg-white text-purple-800 shadow-xs font-bold"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<ClipboardCheck className="h-3.5 w-3.5" />
						會議定案清單
					</button>
				</div>
			</div>

			{/* ========================================================================= */}
			{/* TAB 1: SCENE ROLES & DATA FLOW                                            */}
			{/* ========================================================================= */}
			{activeTab === "flow" && (
				<div className="space-y-4">
					{/* 3 Scene Cards */}
					<div className="grid gap-3 md:grid-cols-3">
						{/* Card 1: Clinic AI Coach */}
						<div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
										<Hospital className="h-4 w-4 text-emerald-700" />
										1. 診間 AI 鏡頭衛教
									</span>
									<span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
										只在診間！
									</span>
								</div>
								<div className="space-y-1.5 text-xs text-slate-700">
									<p>
										<strong>場景：</strong>醫院衛教諮詢室 / 診間專用平板
									</p>
									<p>
										<strong>對象：</strong>病人在藥師眼前操作吸入器
									</p>
									<p>
										<strong>AI 角色：</strong>
										視覺與音訊模型即時辨識「搖勻頻率、吸前吐氣、手口同步、吸氣長度、閉氣維持秒數」。
									</p>
									<p className="text-[11.5px] text-emerald-900 font-medium bg-emerald-100/70 p-1.5 rounded-md mt-2">
										⚡ <strong>減輕負擔關鍵：</strong>辨識結果自動存入{" "}
										<code className="font-mono text-[10px]">sessions</code>，藥師開啟評估表時
										<strong>自動預填 8 項操作步驟</strong>，免手動重複勾選！
									</p>
								</div>
							</div>
							<div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
								<span>量測工具：WASM 輕量模型</span>
								<span>產生 M0/M1 動作數據</span>
							</div>
						</div>

						{/* Card 2: Home LINE Bot */}
						<div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
										<Smartphone className="h-4 w-4 text-blue-700" />
										2. 居家 LINE 官方帳號
									</span>
									<span className="rounded-full bg-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-800">
										長輩日常生活
									</span>
								</div>
								<div className="space-y-1.5 text-xs text-slate-700">
									<p>
										<strong>場景：</strong>病患返家後的手機 LINE 聊天室
									</p>
									<p>
										<strong>長輩體驗：</strong>
										<span className="font-bold text-blue-950">
											零相機、免拍照、免架手機！
										</span>
										長輩在家完全不用對鏡頭操作，徹底杜絕科技抗拒。
									</p>
									<p>
										<strong>LINE 任務：</strong>
										D3/D7/D14/D28 定時推播技巧口訣、看 2 分鐘示範短片、做隨堂測驗、門診回診提醒。
									</p>
									<p className="text-[11.5px] text-blue-900 font-medium bg-blue-100/70 p-1.5 rounded-md mt-2">
										💡 <strong>依從度關鍵：</strong>以溫暖對話加深觀念，記錄長輩已讀率、測驗正答率與回診意願，存入{" "}
										<code className="font-mono text-[10px]">line_events</code>。
									</p>
								</div>
							</div>
							<div className="mt-3 pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800 font-medium">
								<span>零成本：4 則 Push/月</span>
								<span>長輩零門檻隨身複習</span>
							</div>
						</div>

						{/* Card 3: In-Clinic Pharmacist Evaluation */}
						<div className="rounded-xl border border-purple-200 bg-purple-50/50 p-3.5 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between mb-2">
									<span className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
										<Stethoscope className="h-4 w-4 text-purple-700" />
										3. 門診藥師評估覆核
									</span>
									<span className="rounded-full bg-purple-200/80 px-2 py-0.5 text-[10px] font-bold text-purple-800">
										臨床黃金標準
									</span>
								</div>
								<div className="space-y-1.5 text-xs text-slate-700">
									<p>
										<strong>場景：</strong>門診藥局櫃檯 / 衛教諮詢室系統
									</p>
									<p>
										<strong>藥師角色：</strong>
										醫療決策與 QCC 評鑑最終負責人。
									</p>
									<p>
										<strong>工作流程：</strong>
										輸入病歷號調閱診間 AI 測得之動作數據，藥師一鍵覆核並評定其餘衛教步驟（共 33 步驟與關鍵錯誤）。
									</p>
									<p className="text-[11.5px] text-purple-900 font-medium bg-purple-100/70 p-1.5 rounded-md mt-2">
										📊 <strong>QCC 成效產出：</strong>建立 M0（介入前基線）與 M1（介入後複評），驅動後台柏拉圖分析與配對改善檢定！
									</p>
								</div>
							</div>
							<div className="mt-3 pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-purple-800 font-medium">
								<span>依據：QCC 附件七規範</span>
								<span>存入 cases / case_steps</span>
							</div>
						</div>
					</div>

					{/* Closed-Loop Workflow Banner */}
					<div className="rounded-xl bg-slate-900 p-4 text-white shadow-xs">
						<div className="flex items-center gap-2 mb-2">
							<Sparkles className="h-4 w-4 text-emerald-400" />
							<span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
								成效閉環運作動線（Closed-Loop Continuum）
							</span>
						</div>
						<div className="grid gap-2 sm:grid-cols-4 text-xs">
							<div className="rounded-lg bg-slate-800 p-2.5 border border-slate-700">
								<div className="text-[10px] font-bold text-emerald-400">
									STEP 1 • 門診收案 (M0)
								</div>
								<div className="mt-1 font-semibold text-slate-100">
									診間 AI 鏡頭偵測動作
								</div>
								<p className="mt-0.5 text-[11px] text-slate-400">
									長輩在診間對著平板操作，AI 測量閉氣與吸氣時長，自動預填入藥師評估表，建立 M0 初評。
								</p>
							</div>

							<div className="rounded-lg bg-slate-800 p-2.5 border border-slate-700">
								<div className="text-[10px] font-bold text-blue-400">
									STEP 2 • 居家衛教 (D0-D28)
								</div>
								<div className="mt-1 font-semibold text-slate-100">
									LINE 推播口訣與短片
								</div>
								<p className="mt-0.5 text-[11px] text-slate-400">
									長輩出院返家後，LINE 按節奏推播 4 則保養叮嚀與精華影片，無痛維持用藥正確觀念。
								</p>
							</div>

							<div className="rounded-lg bg-slate-800 p-2.5 border border-slate-700">
								<div className="text-[10px] font-bold text-amber-400">
									STEP 3 • 認知檢測 (D24)
								</div>
								<div className="mt-1 font-semibold text-slate-100">
									LINE 對話式隨堂小測驗
								</div>
								<p className="mt-0.5 text-[11px] text-slate-400">
									長輩在聊天室直接點選作答，獲得即時解析回饋，系統收集認知正答率與觀念盲點。
								</p>
							</div>

							<div className="rounded-lg bg-slate-800 p-2.5 border border-slate-700">
								<div className="text-[10px] font-bold text-purple-400">
									STEP 4 • 回診複評 (M1)
								</div>
								<div className="mt-1 font-semibold text-slate-100">
									再次於診間 AI 檢測驗收
								</div>
								<p className="mt-0.5 text-[11px] text-slate-400">
									LINE 提醒帶藥回診，長輩再次進行診間 AI 測試，藥師覆核存入 M1，完成前後成效比對！
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* ========================================================================= */}
			{/* TAB 2: METRICS COLLECTION MATRIX                                          */}
			{/* ========================================================================= */}
			{activeTab === "matrix" && (
				<div className="space-y-3">
					<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
						<table className="w-full text-left border-collapse text-xs">
							<thead>
								<tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200">
									<th className="py-2.5 px-3 font-bold">指標類別</th>
									<th className="py-2.5 px-3 font-bold">具體指標名稱</th>
									<th className="py-2.5 px-3 font-bold">收集場景與工具</th>
									<th className="py-2.5 px-3 font-bold">底層資料表來源</th>
									<th className="py-2.5 px-3 font-bold">QCC 成效儀表板呈現</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 text-slate-600">
								{/* Category 1: AI In-clinic Physical Measurements */}
								<tr className="bg-emerald-50/20">
									<td className="py-2.5 px-3 font-bold text-emerald-900 whitespace-nowrap">
										動作客觀量測
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										閉氣維持秒數（≥ 5 秒達標率）
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
											<Hospital className="h-3 w-3" />
											診間 AI 鏡頭
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										session_stages (stage 3)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										關鍵步驟失誤率、閉氣時間秒數分布圖
									</td>
								</tr>
								<tr className="bg-emerald-50/20">
									<td className="py-2.5 px-3 font-bold text-emerald-900 whitespace-nowrap">
										動作客觀量測
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										手口協調度與慢深吸氣長度
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
											<Hospital className="h-3 w-3" />
											診間 AI 鏡頭
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										session_stages (stage 3)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										MDI 噴吸同步合格率、慢深吸氣達標率
									</td>
								</tr>
								<tr className="bg-emerald-50/20">
									<td className="py-2.5 px-3 font-bold text-emerald-900 whitespace-nowrap">
										動作客觀量測
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										吸入前先吐氣判定
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
											<Hospital className="h-3 w-3" />
											診間 AI 鏡頭
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										session_stages (stage 2)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										步驟錯誤率柏拉圖分析
									</td>
								</tr>
								<tr className="bg-emerald-50/20">
									<td className="py-2.5 px-3 font-bold text-emerald-900 whitespace-nowrap">
										動作客觀量測
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										上下充分搖勻次數與頻率
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800">
											<Hospital className="h-3 w-3" />
											診間 AI 鏡頭
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										session_stages (stage 1)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										MDI 準備步驟錯誤率分析
									</td>
								</tr>

								{/* Category 2: Pharmacist Clinical Outcomes */}
								<tr className="bg-purple-50/20">
									<td className="py-2.5 px-3 font-bold text-purple-900 whitespace-nowrap">
										臨床品質改善
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										33 步驟與關鍵錯誤整體評核
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-medium text-purple-800">
											<Stethoscope className="h-3 w-3" />
											門診藥師覆核
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										cases / case_steps
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										QCC 附件七標準柏拉圖改善前後對比 (M0 vs M1)
									</td>
								</tr>
								<tr className="bg-purple-50/20">
									<td className="py-2.5 px-3 font-bold text-purple-900 whitespace-nowrap">
										臨床品質改善
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										同一病患配對改善率 (Paired)
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[11px] font-medium text-purple-800">
											<Stethoscope className="h-3 w-3" />
											門診藥師複評
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										cases (is_m1 = true)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										個案進步 / 持平 / 退步顯著性檢定
									</td>
								</tr>

								{/* Category 3: LINE Engagement & Adherence */}
								<tr className="bg-blue-50/20">
									<td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
										民眾參與與依從
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										長輩病歷號與 LINE 綁定率
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-800">
											<Smartphone className="h-3 w-3" />
											居家 LINE 帳號
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										line_identities
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										收案追蹤漏斗：已收案 ➔ 已綁定 LINE 比例
									</td>
								</tr>
								<tr className="bg-blue-50/20">
									<td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
										民眾參與與依從
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										示範短片觀看與功能點閱率
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-800">
											<Smartphone className="h-3 w-3" />
											居家 LINE 帳號
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										line_events (video_click)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										居家影片複習次數與參與熱度
									</td>
								</tr>
								<tr className="bg-blue-50/20">
									<td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
										民眾參與與依從
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										隨堂測驗參與率與答對率
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-800">
											<Smartphone className="h-3 w-3" />
											居家 LINE 帳號
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										line_events (quiz_answer)
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										認知正答率、高頻盲點觀念排行
									</td>
								</tr>
								<tr className="bg-blue-50/20">
									<td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
										民眾參與與依從
									</td>
									<td className="py-2.5 px-3 font-semibold text-slate-900">
										門診回診提醒送達與追蹤率
									</td>
									<td className="py-2.5 px-3">
										<span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-800">
											<Smartphone className="h-3 w-3" />
											居家 LINE 帳號
										</span>
									</td>
									<td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
										line_deliveries / cases
									</td>
									<td className="py-2.5 px-3 text-slate-800">
										門診複評追蹤完成率（Follow-up Completion Rate）
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<p className="text-[11px] text-slate-500 italic">
						* 註：診間 AI 鏡頭偵測數據會與病歷號加密雜湊（mrn_hash）關聯，保護病患 PHI 隱私，不傳入非授權公網。
					</p>
				</div>
			)}

			{/* ========================================================================= */}
			{/* TAB 3: PHARMACIST MEETING ALIGNMENT CHECKLIST                             */}
			{/* ========================================================================= */}
			{activeTab === "checklist" && (
				<div className="space-y-3">
					<div className="rounded-xl bg-purple-50/60 p-3.5 border border-purple-200">
						<h3 className="font-bold text-xs text-purple-950 flex items-center gap-1.5 mb-1.5">
							<ClipboardCheck className="h-4 w-4 text-purple-700" />
							本次藥師專案會議定案提問（4 大關鍵確認項目）
						</h3>
						<p className="text-xs text-purple-900 leading-relaxed">
							請與雲林分院藥劑部逐項確認共識，確保臨床作業負擔最小化、QCC 成效數據最大化：
						</p>
					</div>

					<div className="space-y-2 text-xs">
						<div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
							<input
								type="checkbox"
								id="align1"
								defaultChecked
								className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
							/>
							<label htmlFor="align1" className="text-slate-800 leading-relaxed">
								<strong>
									【確認一：診間 AI 是助手，免去藥師 8 次手動點擊】：
								</strong>
								確認 AI 鏡頭定位於「診間動作量化工具」。病人在諮詢室練習後，藥師開啟核檢表時已自動帶入 AI 判定的結果，藥師只需一鍵覆核與微調，大幅節省門診紀錄時間。
							</label>
						</div>

						<div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
							<input
								type="checkbox"
								id="align2"
								defaultChecked
								className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
							/>
							<label htmlFor="align2" className="text-slate-800 leading-relaxed">
								<strong>
									【確認二：長輩在家免相機，LINE 專注認知與提醒】：
								</strong>
								確認長輩返家後<strong>不需要</strong>架設手機對鏡頭操作（避免長輩因科技門檻放棄）。LINE 只負責推播實物口訣卡片、2 分鐘精華短片、隨堂小測驗與回診提醒。
							</label>
						</div>

						<div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
							<input
								type="checkbox"
								id="align3"
								defaultChecked
								className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
							/>
							<label htmlFor="align3" className="text-slate-800 leading-relaxed">
								<strong>
									【確認三：QCC 附件七關鍵步驟（Critical）與 AI 指標對齊】：
								</strong>
								確認診間 AI 測量的「吸前吐氣、手口協調、慢深吸氣、閉氣 5 秒」直接對應 QCC 附件七的關鍵步驟，確保臨床科研與品管標準一致。
							</label>
						</div>

						<div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-2xs">
							<input
								type="checkbox"
								id="align4"
								defaultChecked
								className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
							/>
							<label htmlFor="align4" className="text-slate-800 leading-relaxed">
								<strong>
									【確認四：LINE 官方帳號推播額度 0 元超額控制】：
								</strong>
								確認每月維持 4 則主動 Push 推播（D3/D7/D14/D28），50 人次共消耗 200 則，100% 落在 LINE 台灣免費配額內；長輩主動點擊圖文選單、看影片、答測驗一律為 Webhook Reply 免費回覆。
							</label>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
