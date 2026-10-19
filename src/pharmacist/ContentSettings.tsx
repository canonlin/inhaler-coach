/**
 * LINE 衛教內容管理後台 (Content Settings)
 *
 * 專為雲林分院藥劑部管理者設計，可於後台直接調整：
 * 1. 藥品實物外觀照片（Drugs: 上稿新增、實物圖片、藥名、顏色外型、含類固醇標籤、即時上架／下架）
 * 2. 衛教示範短片（Videos: 上稿新增、YouTube 網址、標題、步驟指引、即時上架／下架）
 * 3. 隨堂測驗題目（Quizzes: 上稿新增、題目、選項、正確答案、藥師重點解析、即時上架／下架）
 *
 * 變更後即時寫入 DB (admin_config)，LINE Bot Webhook 與卡片將即時讀取最新內容生效。
 */

import {
	AlertCircle,
	Check,
	CheckCircle2,
	Eye,
	EyeOff,
	HelpCircle,
	Pill,
	Plus,
	RotateCw,
	Save,
	Trash2,
	Video,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	type AdminConfigResponse,
	type AdminDrugCard,
	type AdminQuizOption,
	type AdminQuizQuestion,
	type AdminVideoConfig,
	fetchAdminConfig,
	saveAdminConfig,
} from "../api-client";
import { Button, Input } from "./components/ui";

type ActiveTab = "drugs" | "videos" | "quizzes";

export function ContentSettings() {
	const [activeTab, setActiveTab] = useState<ActiveTab>("drugs");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const [config, setConfig] = useState<AdminConfigResponse["config"]>({
		videos: [],
		quizzes: {},
		drugs: [],
	});

	// For adding new quiz question
	const [newQuizDevice, setNewQuizDevice] = useState("MDI");

	const loadConfig = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetchAdminConfig();
			if (res.ok && res.config) {
				setConfig(res.config);
			}
		} catch (err) {
			console.error("Failed to load admin config:", err);
			setStatusMessage({
				type: "error",
				text: `讀取設定失敗：${err instanceof Error ? err.message : "未知錯誤"}`,
			});
		} finally {
			setLoading(false);
		}
	}, []);

	// Load existing dynamic configuration from API
	useEffect(() => {
		loadConfig();
	}, [loadConfig]);

	async function handleSave(section: ActiveTab) {
		setSaving(true);
		setStatusMessage(null);
		try {
			const dataToSave = config[section];
			await saveAdminConfig(section, dataToSave, "雲林分院藥劑部管理員");
			setStatusMessage({
				type: "success",
				text: `${getTabLabel(section)}已成功儲存！LINE Bot 將即時套用最新設定。`,
			});
			setTimeout(() => setStatusMessage(null), 4000);
		} catch (err) {
			console.error("Save config error:", err);
			setStatusMessage({
				type: "error",
				text: `儲存失敗：${err instanceof Error ? err.message : "伺服器異常"}`,
			});
		} finally {
			setSaving(false);
		}
	}

	function getTabLabel(tab: ActiveTab) {
		switch (tab) {
			case "drugs":
				return "藥品實物照片與外觀";
			case "videos":
				return "衛教示範影片";
			case "quizzes":
				return "隨堂測驗與解析";
		}
	}

	// ==================== Drug Handlers ====================
	function handleAddDrug() {
		const newDrug: AdminDrugCard = {
			id: `Drug_${Date.now()}`,
			name: "新增吸入劑名稱",
			deviceType: "MDI 定量噴霧",
			colorShape: "外觀顏色特徵",
			technique: "口訣：",
			imageUrl: "https://inhaler-coach.vercel.app/drugs/rapihaler.png",
			hasIcs: false,
			enabled: true,
		};
		setConfig((prev) => ({
			...prev,
			drugs: [newDrug, ...(prev.drugs || [])],
		}));
	}

	function handleToggleDrug(index: number) {
		setConfig((prev) => {
			const next = [...(prev.drugs || [])];
			const cur = next[index];
			next[index] = { ...cur, enabled: cur.enabled === false };
			return { ...prev, drugs: next };
		});
	}

	function handleDeleteDrug(index: number) {
		const item = config.drugs?.[index];
		const name = item?.name || item?.id || "此藥品";
		if (window.confirm(`確定要刪除「${name}」嗎？點選儲存後將同步生效。`)) {
			setConfig((prev) => ({
				...prev,
				drugs: (prev.drugs || []).filter((_, i) => i !== index),
			}));
		}
	}

	// ==================== Video Handlers ====================
	function handleAddVideo() {
		const newVideo: AdminVideoConfig = {
			id: `VIDEO_${Date.now()}`,
			type: "MDI",
			deviceType: "MDI",
			title: "【MDI 定量噴霧】標準操作示範教學",
			videoUrl: "https://www.youtube.com/watch?v=...",
			description:
				"1. 上下充分搖勻 5 秒\n2. 先吐氣到底（遠離吸嘴）\n3. 緊含吸嘴，按壓同時慢深吸氣 5 秒\n4. 移開吸嘴閉氣 5 秒以上\n5. 若含類固醇記得漱口",
			enabled: true,
		};
		setConfig((prev) => ({
			...prev,
			videos: [newVideo, ...(prev.videos || [])],
		}));
	}

	function handleToggleVideo(index: number) {
		setConfig((prev) => {
			const next = [...(prev.videos || [])];
			const cur = next[index];
			next[index] = { ...cur, enabled: cur.enabled === false };
			return { ...prev, videos: next };
		});
	}

	function handleDeleteVideo(index: number) {
		const item = config.videos?.[index];
		const name = item?.title || item?.id || "此影片";
		if (window.confirm(`確定要刪除「${name}」嗎？點選儲存後將同步生效。`)) {
			setConfig((prev) => ({
				...prev,
				videos: (prev.videos || []).filter((_, i) => i !== index),
			}));
		}
	}

	// ==================== Quiz Handlers ====================
	function handleAddQuiz(deviceKey: string) {
		const next = { ...config.quizzes };
		const existing = next[deviceKey] ? [...next[deviceKey]] : [];
		const newQ: AdminQuizQuestion = {
			id: `${deviceKey}_Q${existing.length + 1}`,
			question: `使用 ${deviceKey} 吸入劑時，正確的吸氣操作為何？`,
			options: [
				{ id: "A", text: "選項說明 A" },
				{ id: "B", text: "選項說明 B" },
				{ id: "C", text: "選項說明 C" },
			],
			correctAnswer: "A",
			explanation: "答題後藥師重點衛教指引說明...",
			enabled: true,
		};
		next[deviceKey] = [...existing, newQ];
		setConfig((prev) => ({ ...prev, quizzes: next }));
	}

	function handleToggleQuiz(deviceKey: string, qIndex: number) {
		const next = { ...config.quizzes };
		if (!next[deviceKey]) return;
		const list = [...next[deviceKey]];
		const q = list[qIndex];
		list[qIndex] = { ...q, enabled: q.enabled === false };
		next[deviceKey] = list;
		setConfig((prev) => ({ ...prev, quizzes: next }));
	}

	function handleDeleteQuiz(deviceKey: string, qIndex: number) {
		const q = config.quizzes?.[deviceKey]?.[qIndex];
		const title = q?.question || `第 ${qIndex + 1} 題`;
		if (window.confirm(`確定要刪除「${title}」嗎？點選儲存後將同步生效。`)) {
			const next = { ...config.quizzes };
			if (next[deviceKey]) {
				next[deviceKey] = next[deviceKey].filter((_, i) => i !== qIndex);
				if (next[deviceKey].length === 0) {
					delete next[deviceKey];
				}
			}
			setConfig((prev) => ({ ...prev, quizzes: next }));
		}
	}

	function handleAddOption(deviceKey: string, qIndex: number) {
		const next = { ...config.quizzes };
		const q = next[deviceKey]?.[qIndex];
		if (!q) return;
		const curOpts = q.options || [];
		const nextChar = String.fromCharCode(65 + curOpts.length);
		const newOpt: AdminQuizOption = { id: nextChar, text: "" };
		next[deviceKey][qIndex] = {
			...q,
			options: [...curOpts, newOpt],
		};
		setConfig((prev) => ({ ...prev, quizzes: next }));
	}

	function handleDeleteOption(
		deviceKey: string,
		qIndex: number,
		optIndex: number,
	) {
		const next = { ...config.quizzes };
		const q = next[deviceKey]?.[qIndex];
		if (!q || !q.options || q.options.length <= 2) {
			alert("測驗題至少須保留 2 個選項！");
			return;
		}
		const opts = q.options.filter((_, i) => i !== optIndex);
		let correct = q.correctAnswer;
		if (correct === q.options[optIndex].id) {
			correct = opts[0]?.id || "A";
		}
		next[deviceKey][qIndex] = {
			...q,
			options: opts,
			correctAnswer: correct,
		};
		setConfig((prev) => ({ ...prev, quizzes: next }));
	}

	// Statistics
	const drugCount = config.drugs?.length || 0;
	const activeDrugCount =
		config.drugs?.filter((d) => d.enabled !== false).length || 0;
	const inactiveDrugCount = drugCount - activeDrugCount;

	const videoCount = config.videos?.length || 0;
	const activeVideoCount =
		config.videos?.filter((v) => v.enabled !== false).length || 0;
	const inactiveVideoCount = videoCount - activeVideoCount;

	const allQuizList = Object.values(config.quizzes || {}).flat();
	const quizCount = allQuizList.length;
	const activeQuizCount = allQuizList.filter((q) => q.enabled !== false).length;
	const inactiveQuizCount = quizCount - activeQuizCount;

	return (
		<div data-testid="content-settings" className="space-y-6">
			{/* Top Header */}
			<div className="flex flex-col gap-2 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-bold tracking-tight text-primary">
						LINE 衛教素材管理與上稿
					</h2>
					<p className="mt-1 text-sm text-text-secondary">
						雲林分院專屬後台：隨時新增上稿、修改圖文、一鍵上架／下架，變更將即時同步於 LINE 官方帳號。
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={loadConfig}
						disabled={loading || saving}
					>
						<RotateCw className="mr-1.5 h-4 w-4" />
						重新載入
					</Button>
					<Button
						variant="primary"
						size="sm"
						onClick={() => handleSave(activeTab)}
						disabled={loading || saving}
					>
						<Save className="mr-1.5 h-4 w-4" />
						{saving ? "儲存中..." : `儲存${getTabLabel(activeTab)}`}
					</Button>
				</div>
			</div>

			{/* Status Banner */}
			{statusMessage && (
				<div
					className={`flex items-center gap-2.5 rounded-md p-4 text-sm font-medium ${
						statusMessage.type === "success"
							? "border border-emerald-300 bg-emerald-50 text-emerald-800"
							: "border border-rose-300 bg-rose-50 text-rose-800"
					}`}
				>
					{statusMessage.type === "success" ? (
						<CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
					) : (
						<AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
					)}
					<span>{statusMessage.text}</span>
				</div>
			)}

			{/* Sub Tabs */}
			<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border">
				<div className="flex gap-2">
					{(["drugs", "videos", "quizzes"] as const).map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-base font-semibold transition-colors ${
								activeTab === tab
									? "border-primary text-primary"
									: "border-transparent text-text-secondary hover:text-text"
							}`}
						>
							{tab === "drugs" && (
								<>
									<Pill className="h-4 w-4" />
									<span>藥品實物卡片 ({activeDrugCount}/{drugCount})</span>
								</>
							)}
							{tab === "videos" && (
								<>
									<Video className="h-4 w-4" />
									<span>衛教示範短片 ({activeVideoCount}/{videoCount})</span>
								</>
							)}
							{tab === "quizzes" && (
								<>
									<HelpCircle className="h-4 w-4" />
									<span>隨堂測驗題庫 ({activeQuizCount}/{quizCount})</span>
								</>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="py-12 text-center text-text-muted">
					載入雲端設定中，請稍候...
				</div>
			)}

			{/* ==================== TAB 1: DRUGS ==================== */}
			{!loading && activeTab === "drugs" && (
				<div className="space-y-6">
					{/* Action bar & Stats */}
					<div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<div className="text-sm font-bold text-text">
								藥品實物辨識卡列表
							</div>
							<div className="flex items-center gap-2 text-xs text-text-muted">
								<span>總共 {drugCount} 筆</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
									<span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
									已上架 {activeDrugCount} 筆 (LINE 端輪播顯示，上限 10 筆)
								</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 text-slate-500">
									<span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
									已下架 {inactiveDrugCount} 筆
								</span>
							</div>
						</div>
						<Button
							variant="primary"
							size="sm"
							onClick={handleAddDrug}
							className="shrink-0"
						>
							<Plus className="mr-1.5 h-4 w-4" />
							新增藥品卡片 (上稿)
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{(config.drugs || []).map((drug, index) => {
							const isOn = drug.enabled !== false;
							return (
								<div
									key={drug.id || index}
									className={`flex flex-col gap-4 rounded-lg border p-5 shadow-sm transition-all ${
										isOn
											? "border-border bg-surface"
											: "border-dashed border-slate-300 bg-slate-50/70 opacity-80"
									}`}
								>
									{/* Top control bar: on/off shelf toggle & delete */}
									<div className="flex items-center justify-between border-b border-border-subtle pb-3">
										<div className="flex items-center gap-2">
											<span className="font-mono text-xs font-bold text-text-muted">
												#{index + 1} {drug.id}
											</span>
											{!isOn && (
												<span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
													長輩端已隱藏
												</span>
											)}
										</div>
										<div className="flex items-center gap-2">
											{/* Toggle Button */}
											<button
												type="button"
												onClick={() => handleToggleDrug(index)}
												className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
													isOn
														? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
														: "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
												}`}
												title={
													isOn
														? "點擊下架此藥品（LINE 對話將不再推送）"
														: "點擊上架此藥品（重新於 LINE 輪播卡片中顯示）"
												}
											>
												{isOn ? (
													<>
														<Eye className="h-3.5 w-3.5 text-emerald-600" />
														<span>已上架</span>
													</>
												) : (
													<>
														<EyeOff className="h-3.5 w-3.5 text-slate-500" />
														<span>已下架</span>
													</>
												)}
											</button>

											{/* Delete button */}
											<button
												type="button"
												onClick={() => handleDeleteDrug(index)}
												className="rounded p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
												title="刪除此藥品卡片"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>

									<div className="flex items-start gap-4">
										{/* Photo Preview */}
										<div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-slate-100">
											<img
												src={drug.imageUrl}
												alt={drug.name}
												className="h-full w-full object-cover"
												onError={(e) => {
													(e.target as HTMLImageElement).src =
														"https://inhaler-coach.vercel.app/drugs/rapihaler.png";
												}}
											/>
										</div>

										{/* Primary Fields */}
										<div className="grow space-y-2">
											<div>
												<div className="mb-1 text-xs font-bold text-text-muted">
													藥品名稱 (顯示於卡片主標題)
												</div>
												<Input
													value={drug.name || ""}
													onChange={(e) => {
														const next = [...(config.drugs || [])];
														next[index] = { ...drug, name: e.target.value };
														setConfig({ ...config, drugs: next });
													}}
													placeholder="例如：都保噴霧 (Symbicort)"
												/>
											</div>

											<div className="flex gap-2">
												<div className="w-1/2">
													<div className="mb-1 text-xs font-bold text-text-muted">
														裝置分類
													</div>
													<Input
														value={drug.deviceType || ""}
														onChange={(e) => {
															const next = [...(config.drugs || [])];
															next[index] = {
																...drug,
																deviceType: e.target.value,
															};
															setConfig({ ...config, drugs: next });
														}}
														placeholder="例如：MDI 定量噴霧"
													/>
												</div>
												<div className="w-1/2">
													<div className="mb-1 text-xs font-bold text-text-muted">
														類固醇註記
													</div>
													<div className="flex h-12 items-center gap-2">
														<input
															type="checkbox"
															id={`ics-${drug.id}-${index}`}
															checked={Boolean(drug.hasIcs)}
															onChange={(e) => {
																const next = [...(config.drugs || [])];
																next[index] = {
																	...drug,
																	hasIcs: e.target.checked,
																};
																setConfig({ ...config, drugs: next });
															}}
															className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
														/>
														<label
															htmlFor={`ics-${drug.id}-${index}`}
															className="text-sm font-semibold text-text"
														>
															{drug.hasIcs ? "含類固醇" : "無類固醇"}
														</label>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Secondary Detail Inputs */}
									<div className="space-y-3">
										<div>
											<div className="mb-1 text-xs font-bold text-text-muted">
												外觀顏色特徵 (秒認實物，避免拿錯藥)
											</div>
											<Input
												value={drug.colorShape || ""}
												onChange={(e) => {
													const next = [...(config.drugs || [])];
													next[index] = { ...drug, colorShape: e.target.value };
													setConfig({ ...config, drugs: next });
												}}
												placeholder="例如：紅白色・L型噴罐"
											/>
										</div>

										<div>
											<div className="mb-1 text-xs font-bold text-text-muted">
												實物圖片 URL (支援 https 網址)
											</div>
											<Input
												value={drug.imageUrl || ""}
												onChange={(e) => {
													const next = [...(config.drugs || [])];
													next[index] = { ...drug, imageUrl: e.target.value };
													setConfig({ ...config, drugs: next });
												}}
												placeholder="https://..."
											/>
										</div>

										<div>
											<div className="mb-1 text-xs font-bold text-text-muted">
												操作口訣重點
											</div>
											<Input
												value={drug.technique || ""}
												onChange={(e) => {
													const next = [...(config.drugs || [])];
													next[index] = { ...drug, technique: e.target.value };
													setConfig({ ...config, drugs: next });
												}}
												placeholder="例如：口訣：上下搖勻・慢深吸 5 秒"
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* ==================== TAB 2: VIDEOS ==================== */}
			{!loading && activeTab === "videos" && (
				<div className="space-y-6">
					{/* Action bar & Stats */}
					<div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<div className="text-sm font-bold text-text">
								衛教示範短片列表
							</div>
							<div className="flex items-center gap-2 text-xs text-text-muted">
								<span>總共 {videoCount} 部</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
									<span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
									已上架 {activeVideoCount} 部 (長輩點選影片時播放)
								</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 text-slate-500">
									<span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
									已下架 {inactiveVideoCount} 部
								</span>
							</div>
						</div>
						<Button
							variant="primary"
							size="sm"
							onClick={handleAddVideo}
							className="shrink-0"
						>
							<Plus className="mr-1.5 h-4 w-4" />
							新增衛教影片 (上稿)
						</Button>
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{(config.videos || []).map((video, index) => {
							const isOn = video.enabled !== false;
							return (
								<div
									key={video.id || index}
									className={`flex flex-col gap-4 rounded-lg border p-5 shadow-sm transition-all ${
										isOn
											? "border-border bg-surface"
											: "border-dashed border-slate-300 bg-slate-50/70 opacity-80"
									}`}
								>
									{/* Top Bar */}
									<div className="flex items-center justify-between border-b border-border-subtle pb-3">
										<div className="flex items-center gap-2">
											<span className="rounded bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
												{video.type ||
													video.scope ||
													video.deviceType ||
													"通用"}
											</span>
											<span className="font-mono text-xs text-text-muted">
												{video.id}
											</span>
											{!isOn && (
												<span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
													已下架
												</span>
											)}
										</div>
										<div className="flex items-center gap-2">
											{/* Toggle Button */}
											<button
												type="button"
												onClick={() => handleToggleVideo(index)}
												className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
													isOn
														? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
														: "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
												}`}
												title={
													isOn
														? "點擊下架此影片"
														: "點擊上架此影片（長輩可點閱）"
												}
											>
												{isOn ? (
													<>
														<Eye className="h-3.5 w-3.5 text-emerald-600" />
														<span>已上架</span>
													</>
												) : (
													<>
														<EyeOff className="h-3.5 w-3.5 text-slate-500" />
														<span>已下架</span>
													</>
												)}
											</button>

											<button
												type="button"
												onClick={() => handleDeleteVideo(index)}
												className="rounded p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
												title="刪除此衛教影片"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>

									<div className="space-y-3">
										<div className="flex gap-2">
											<div className="w-1/3">
												<div className="mb-1 text-xs font-bold text-text-muted">
													適用裝置代碼
												</div>
												<Input
													value={video.type || video.deviceType || ""}
													onChange={(e) => {
														const next = [...(config.videos || [])];
														next[index] = {
															...video,
															type: e.target.value,
															deviceType: e.target.value,
														};
														setConfig({ ...config, videos: next });
													}}
													placeholder="MDI / DPI / SMI"
												/>
											</div>
											<div className="w-2/3">
												<div className="mb-1 text-xs font-bold text-text-muted">
													影片標題
												</div>
												<Input
													value={video.title || ""}
													onChange={(e) => {
														const next = [...(config.videos || [])];
														next[index] = { ...video, title: e.target.value };
														setConfig({ ...config, videos: next });
													}}
													placeholder="例如：【MDI 定量噴霧】標準操作教學"
												/>
											</div>
										</div>

										<div>
											<div className="mb-1 text-xs font-bold text-text-muted">
												YouTube 或短片連結網址
											</div>
											<Input
												value={video.videoUrl || ""}
												onChange={(e) => {
													const next = [...(config.videos || [])];
													next[index] = { ...video, videoUrl: e.target.value };
													setConfig({ ...config, videos: next });
												}}
												placeholder="https://www.youtube.com/watch?v=..."
											/>
										</div>

										<div>
											<div className="mb-1 text-xs font-bold text-text-muted">
												胸腔醫學會標準步驟指引 (長輩卡片文字重點，可換行)
											</div>
											<textarea
												rows={4}
												className="w-full rounded-md border border-border bg-surface p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
												value={
													typeof video.description === "string"
														? video.description
														: Array.isArray(video.steps)
															? video.steps.join("\n")
															: ""
												}
												onChange={(e) => {
													const next = [...(config.videos || [])];
													next[index] = {
														...video,
														description: e.target.value,
													};
													setConfig({ ...config, videos: next });
												}}
												placeholder="1. 上下搖勻 5 秒&#10;2. 先吐氣到底..."
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* ==================== TAB 3: QUIZZES ==================== */}
			{!loading && activeTab === "quizzes" && (
				<div className="space-y-6">
					{/* Action bar & Stats */}
					<div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<div className="text-sm font-bold text-text">
								隨堂測驗題庫管理
							</div>
							<div className="flex items-center gap-2 text-xs text-text-muted">
								<span>總共 {quizCount} 題</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
									<span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
									已上架 {activeQuizCount} 題 (LINE 端隨堂測驗開放)
								</span>
								<span>•</span>
								<span className="inline-flex items-center gap-1.5 text-slate-500">
									<span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
									已下架 {inactiveQuizCount} 題
								</span>
							</div>
						</div>

						{/* Add quiz selector */}
						<div className="flex items-center gap-2">
							<select
								value={newQuizDevice}
								onChange={(e) => setNewQuizDevice(e.target.value)}
								className="h-10 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-text"
							>
								<option value="MDI">MDI 定量吸入劑</option>
								<option value="DPI">DPI 乾粉吸入劑</option>
								<option value="SMI">SMI 軟霧吸入劑</option>
								<option value="Aerosphere">Aerosphere 氣霧劑</option>
							</select>
							<Button
								variant="primary"
								size="sm"
								onClick={() => handleAddQuiz(newQuizDevice)}
								className="shrink-0"
							>
								<Plus className="mr-1.5 h-4 w-4" />
								新增測驗題 (上稿)
							</Button>
						</div>
					</div>

					<div className="space-y-6">
						{Object.entries(config.quizzes || {}).map(([deviceKey, qList]) => {
							const questions = Array.isArray(qList) ? qList : [qList];
							return (
								<div key={deviceKey} className="space-y-4">
									<div className="flex items-center gap-2 border-b border-border pb-2">
										<span className="rounded bg-teal-100 px-3 py-1 text-sm font-bold text-teal-900">
											【{deviceKey}】吸入劑題組 ({questions.length} 題)
										</span>
									</div>

									<div className="grid grid-cols-1 gap-6">
										{questions.map((q, qIndex) => {
											if (!q) return null;
											const isOn = q.enabled !== false;
											return (
												<div
													key={q.id || qIndex}
													className={`flex flex-col gap-4 rounded-lg border p-5 shadow-sm transition-all ${
														isOn
															? "border-border bg-surface"
															: "border-dashed border-slate-300 bg-slate-50/70 opacity-80"
													}`}
												>
													{/* Card Header */}
													<div className="flex items-center justify-between border-b border-border-subtle pb-3">
														<div className="flex items-center gap-2">
															<span className="font-mono text-xs font-bold text-text-muted">
																ID: {q.id}
															</span>
															<span className="rounded bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
																正解選項：({q.correctAnswer})
															</span>
															{!isOn && (
																<span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
																	已下架
																</span>
															)}
														</div>
														<div className="flex items-center gap-2">
															{/* Toggle Button */}
															<button
																type="button"
																onClick={() =>
																	handleToggleQuiz(deviceKey, qIndex)
																}
																className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors ${
																	isOn
																		? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
																		: "border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
																}`}
																title={
																	isOn
																		? "點擊下架此測驗題"
																		: "點擊上架此測驗題（長輩可測驗）"
																}
															>
																{isOn ? (
																	<>
																		<Eye className="h-3.5 w-3.5 text-emerald-600" />
																		<span>已上架</span>
																	</>
																) : (
																	<>
																		<EyeOff className="h-3.5 w-3.5 text-slate-500" />
																		<span>已下架</span>
																	</>
																)}
															</button>

															<button
																type="button"
																onClick={() =>
																	handleDeleteQuiz(deviceKey, qIndex)
																}
																className="rounded p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
																title="刪除此測驗題"
															>
																<Trash2 className="h-4 w-4" />
															</button>
														</div>
													</div>

													<div className="space-y-4">
														<div>
															<div className="mb-1 text-xs font-bold text-text-muted">
																測驗題目
															</div>
															<Input
																value={q.question || ""}
																onChange={(e) => {
																	const next = { ...config.quizzes };
																	next[deviceKey][qIndex] = {
																		...q,
																		question: e.target.value,
																	};
																	setConfig({ ...config, quizzes: next });
																}}
																placeholder="請輸入測驗題目文字..."
															/>
														</div>

														{/* Options List */}
														<div className="space-y-2">
															<div className="flex items-center justify-between">
																<div className="text-xs font-bold text-text-muted">
																	選項設定與正解標記（綠色標籤為正解）
																</div>
																<button
																	type="button"
																	onClick={() =>
																		handleAddOption(deviceKey, qIndex)
																	}
																	className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
																>
																	<Plus className="h-3.5 w-3.5" /> 新增選項
																</button>
															</div>

															{(q.options || []).map((opt, optIndex) => (
																<div
																	key={opt.id || optIndex}
																	className="flex items-center gap-3"
																>
																	<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-bold text-primary">
																		{opt.id}
																	</span>
																	<Input
																		className="grow"
																		value={opt.text || ""}
																		onChange={(e) => {
																			const next = { ...config.quizzes };
																			const opts = [...q.options];
																			opts[optIndex] = {
																				...opt,
																				text: e.target.value,
																			};
																			next[deviceKey][qIndex] = {
																				...q,
																				options: opts,
																			};
																			setConfig({
																				...config,
																				quizzes: next,
																			});
																		}}
																		placeholder={`選項 ${opt.id} 內容`}
																	/>
																	<button
																		type="button"
																		onClick={() => {
																			const next = { ...config.quizzes };
																			next[deviceKey][qIndex] = {
																				...q,
																				correctAnswer: opt.id,
																			};
																			setConfig({
																				...config,
																				quizzes: next,
																			});
																		}}
																		className={`shrink-0 rounded px-3 py-1.5 text-xs font-bold transition-colors ${
																			q.correctAnswer === opt.id
																				? "bg-emerald-600 text-white"
																				: "bg-surface-muted text-text-muted hover:bg-surface-border"
																		}`}
																	>
																		{q.correctAnswer === opt.id ? (
																			<span className="inline-flex items-center gap-1">
																				<Check className="h-3.5 w-3.5" />
																				正確解答
																			</span>
																		) : (
																			"設為正解"
																		)}
																	</button>
																	<button
																		type="button"
																		onClick={() =>
																			handleDeleteOption(
																				deviceKey,
																				qIndex,
																				optIndex,
																			)
																		}
																		className="rounded p-1 text-text-muted hover:text-rose-600"
																		title="刪除此選項"
																	>
																		<Trash2 className="h-4 w-4" />
																	</button>
																</div>
															))}
														</div>

														{/* Explanation */}
														<div>
															<div className="mb-1 text-xs font-bold text-text-muted">
																答題後藥師重點解析說明 (長輩完成測驗後回傳)
															</div>
															<textarea
																rows={3}
																className="w-full rounded-md border border-border bg-surface p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
																value={q.explanation || ""}
																onChange={(e) => {
																	const next = { ...config.quizzes };
																	next[deviceKey][qIndex] = {
																		...q,
																		explanation: e.target.value,
																	};
																	setConfig({ ...config, quizzes: next });
																}}
																placeholder="輸入操作原理與臨床衛教解析..."
															/>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
