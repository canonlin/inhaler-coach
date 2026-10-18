/**
 * LINE 衛教內容管理後台 (Content Settings)
 *
 * 專為雲林分院藥劑部管理者設計，可於後台直接調整：
 * 1. 衛教示範影片（Videos: YouTube 網址、標題、步驟指引）
 * 2. 藥品實物外觀照片（Drugs: 實物圖片網址、藥名、顏色外型、含類固醇標籤）
 * 3. 隨堂測驗題目（Quizzes: 題目、選項、正確答案、藥師重點解析）
 *
 * 變更後即時寫入 DB (admin_config)，LINE Bot Webhook 與卡片將即時讀取最新內容生效。
 */

import { useCallback, useEffect, useState } from "react";
import {
	type AdminConfigResponse,
	fetchAdminConfig,
	saveAdminConfig,
} from "../api-client";
import { Button, Input } from "./components/ui";

type ActiveTab = "videos" | "drugs" | "quizzes";

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

	async function handleSave(section: "videos" | "drugs" | "quizzes") {
		setSaving(true);
		setStatusMessage(null);
		try {
			const dataToSave = config[section];
			await saveAdminConfig(section, dataToSave, "雲林分院藥劑部管理員");
			setStatusMessage({
				type: "success",
				text: `✅ ${getTabLabel(section)}已成功儲存！LINE Bot 將即時套用最新設定。`,
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

	return (
		<div className="space-y-6 p-6">
			{/* Top Header */}
			<div className="flex flex-col gap-2 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-primary">
						LINE 衛教內容與影音管理
					</h1>
					<p className="text-sm text-text-muted">
						設定即時同步至 LINE Bot 對話互動，無須重新發布或重啟程式碼。
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={loadConfig}
						disabled={loading || saving}
					>
						重新載入
					</Button>
					<Button
						variant="primary"
						size="sm"
						onClick={() => handleSave(activeTab)}
						disabled={loading || saving}
					>
						{saving ? "儲存中..." : "儲存目前設定"}
					</Button>
				</div>
			</div>

			{/* Status Banner */}
			{statusMessage && (
				<div
					className={`rounded-md p-4 text-sm font-medium ${
						statusMessage.type === "success"
							? "border border-emerald-300 bg-emerald-50 text-emerald-800"
							: "border border-rose-300 bg-rose-50 text-rose-800"
					}`}
				>
					{statusMessage.text}
				</div>
			)}

			{/* Sub Tabs */}
			<div className="flex gap-2 border-b border-border">
				{(["drugs", "videos", "quizzes"] as const).map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={`border-b-2 px-4 py-2.5 text-base font-semibold transition-colors ${
							activeTab === tab
								? "border-primary text-primary"
								: "border-transparent text-text-secondary hover:text-text"
						}`}
					>
						{tab === "drugs" && "💊 藥品實物照片"}
						{tab === "videos" && "📹 衛教示範短片"}
						{tab === "quizzes" && "✍️ 隨堂測驗題目"}
					</button>
				))}
			</div>

			{/* Loading State */}
			{loading && (
				<div className="py-12 text-center text-text-muted">
					載入雲端設定中，請稍候...
				</div>
			)}

			{/* Tab 1: Drugs / Product Photos */}
			{!loading && activeTab === "drugs" && (
				<div className="space-y-6">
					<div className="rounded-md bg-surface-muted p-4 text-sm text-text-secondary">
						💡
						提示：此處設定將直接呈現在長輩的「實物照片左右滑動輪播卡片」中。建議使用清晰、高辨識度的藥品實拍圖片網址。
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{(config.drugs || []).map((drug, index) => (
							<div
								key={drug.id || index}
								className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
							>
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
											<div className="text-xs font-bold text-text-muted mb-1">
												藥品名稱 (顯示於卡片主標題)
											</div>
											<Input
												value={drug.name || ""}
												onChange={(e) => {
													const next = [...config.drugs];
													next[index] = { ...drug, name: e.target.value };
													setConfig({ ...config, drugs: next });
												}}
												placeholder="例如：都保噴霧 (Symbicort)"
											/>
										</div>

										<div className="flex gap-2">
											<div className="w-1/2">
												<div className="text-xs font-bold text-text-muted mb-1">
													裝置分類
												</div>
												<Input
													value={drug.deviceType || ""}
													onChange={(e) => {
														const next = [...config.drugs];
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
												<div className="text-xs font-bold text-text-muted mb-1">
													類固醇註記
												</div>
												<div className="flex h-12 items-center gap-2">
													<input
														type="checkbox"
														id={`ics-${drug.id}`}
														checked={Boolean(drug.hasIcs)}
														onChange={(e) => {
															const next = [...config.drugs];
															next[index] = {
																...drug,
																hasIcs: e.target.checked,
															};
															setConfig({ ...config, drugs: next });
														}}
														className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
													/>
													<label
														htmlFor={`ics-${drug.id}`}
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
										<div className="text-xs font-bold text-text-muted mb-1">
											外觀顏色特徵 (幫助長輩秒認實物)
										</div>
										<Input
											value={drug.colorShape || ""}
											onChange={(e) => {
												const next = [...config.drugs];
												next[index] = { ...drug, colorShape: e.target.value };
												setConfig({ ...config, drugs: next });
											}}
											placeholder="例如：🔴 紅白色・L型噴罐"
										/>
									</div>

									<div>
										<div className="text-xs font-bold text-text-muted mb-1">
											實物圖片 URL (支援 https 網址)
										</div>
										<Input
											value={drug.imageUrl || ""}
											onChange={(e) => {
												const next = [...config.drugs];
												next[index] = { ...drug, imageUrl: e.target.value };
												setConfig({ ...config, drugs: next });
											}}
											placeholder="https://..."
										/>
									</div>

									<div>
										<div className="text-xs font-bold text-text-muted mb-1">
											操作口訣重點
										</div>
										<Input
											value={drug.technique || ""}
											onChange={(e) => {
												const next = [...config.drugs];
												next[index] = { ...drug, technique: e.target.value };
												setConfig({ ...config, drugs: next });
											}}
											placeholder="例如：口訣：上下搖勻・慢深吸 5 秒"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Tab 2: Videos / Educational Videos */}
			{!loading && activeTab === "videos" && (
				<div className="space-y-6">
					<div className="rounded-md bg-surface-muted p-4 text-sm text-text-secondary">
						💡
						提示：長輩或民眾點擊「操作影片」時，將送出此卡片。您可以變更標準操作短片的
						YouTube 連結與臨床 5 大步驟指引說明。
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{(config.videos || []).map((video, index) => (
							<div
								key={video.id || index}
								className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
							>
								<div className="flex items-center justify-between border-b border-border-subtle pb-2">
									<span className="rounded bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
										{video.type || video.scope}
									</span>
									<span className="text-xs text-text-muted">
										ID: {video.id}
									</span>
								</div>

								<div className="space-y-3">
									<div>
										<div className="text-xs font-bold text-text-muted mb-1">
											影片標題
										</div>
										<Input
											value={video.title || ""}
											onChange={(e) => {
												const next = [...config.videos];
												next[index] = { ...video, title: e.target.value };
												setConfig({ ...config, videos: next });
											}}
											placeholder="例如：【MDI 定量噴霧】標準操作教學"
										/>
									</div>

									<div>
										<div className="text-xs font-bold text-text-muted mb-1">
											YouTube 或影片播放網址
										</div>
										<Input
											value={video.videoUrl || ""}
											onChange={(e) => {
												const next = [...config.videos];
												next[index] = { ...video, videoUrl: e.target.value };
												setConfig({ ...config, videos: next });
											}}
											placeholder="https://www.youtube.com/watch?v=..."
										/>
									</div>

									<div>
										<div className="text-xs font-bold text-text-muted mb-1">
											衛教指引或步驟重點 (可多行換行)
										</div>
										<textarea
											rows={4}
											className="w-full rounded-md border border-border bg-surface p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
											value={video.description || ""}
											onChange={(e) => {
												const next = [...config.videos];
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
						))}
					</div>
				</div>
			)}

			{/* Tab 3: Quizzes / In-chat Quiz Questions */}
			{!loading && activeTab === "quizzes" && (
				<div className="space-y-6">
					<div className="rounded-md bg-surface-muted p-4 text-sm text-text-secondary">
						💡
						提示：設定長輩與病友在對話中的隨堂測驗題目。答題後機器人會自動核對正確答案，並回傳藥師重點解析。
					</div>

					<div className="grid grid-cols-1 gap-6">
						{Object.entries(config.quizzes || {}).map(([deviceKey, qList]) => {
							const q = Array.isArray(qList) ? qList[0] : qList;
							if (!q) return null;

							return (
								<div
									key={deviceKey}
									className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm"
								>
									<div className="flex items-center justify-between border-b border-border-subtle pb-2">
										<span className="rounded bg-teal-100 px-3 py-1 text-sm font-bold text-teal-800">
											{deviceKey} 裝置自我測驗題
										</span>
										<span className="text-xs text-text-muted">
											正確選項：({q.correctAnswer})
										</span>
									</div>

									<div className="space-y-3">
										<div>
											<div className="text-xs font-bold text-text-muted mb-1">
												測驗題目
											</div>
											<Input
												value={q.question || ""}
												onChange={(e) => {
													const next = { ...config.quizzes };
													next[deviceKey][0] = {
														...q,
														question: e.target.value,
													};
													setConfig({ ...config, quizzes: next });
												}}
												placeholder="題目文字..."
											/>
										</div>

										{/* Options */}
										<div className="space-y-2">
											<div className="text-xs font-bold text-text-muted mb-1">
												選項設定與解答標示
											</div>
											{(q.options || []).map((opt, optIndex) => (
												<div
													key={opt.id || optIndex}
													className="flex items-center gap-3"
												>
													<span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-sm font-bold text-primary">
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
															next[deviceKey][0] = {
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
															next[deviceKey][0] = {
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
														{q.correctAnswer === opt.id
															? "✓ 正確解答"
															: "設為正解"}
													</button>
												</div>
											))}
										</div>

										{/* Explanation */}
										<div>
											<div className="text-xs font-bold text-text-muted mb-1">
												答題後藥師重點解析說明 (回傳長輩)
											</div>
											<textarea
												rows={3}
												className="w-full rounded-md border border-border bg-surface p-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
												value={q.explanation || ""}
												onChange={(e) => {
													const next = { ...config.quizzes };
													next[deviceKey][0] = {
														...q,
														explanation: e.target.value,
													};
													setConfig({ ...config, quizzes: next });
												}}
												placeholder="輸入衛教原理與步驟解析..."
											/>
										</div>
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
