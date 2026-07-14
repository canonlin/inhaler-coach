import { GAS_URL } from "../config/stages.js";
import { state } from "./state.js";

export async function sendSessionData() {
	if (!state.patientId) return;
	if (state.sessionDataSent) return;

	for (let i = 1; i <= 4; i++) {
		if (!state.stagePharmacist[i] || state.stagePharmacist[i] === "") {
			console.warn(`⚠️ 第${i}關尚未完成，不送出資料`);
			return;
		}
	}

	state.sessionDataSent = true;

	const ts = (() => {
		const d = new Date();
		const offset = d.getTime() + 8 * 3600000;
		const t = new Date(offset);
		return t.toISOString().substring(0, 19).replace("T", "_");
	})();

	const params = new URLSearchParams({
		action: "ai_coach_record",
		pid: state.patientId,
		ts,
		s1a: state.stageAttempts[1] || 0,
		s1c: state.stageAIConfidence[1] || 0,
		s1p: state.stagePharmacist[1] || "not_recorded",
		s2a: state.stageAttempts[2] || 0,
		s2c: state.stageAIConfidence[2] || 0,
		s2p: state.stagePharmacist[2] || "not_recorded",
		s3a: state.stageAttempts[3] || 0,
		s3c: state.stageAIConfidence[3] || 0,
		s3p: state.stagePharmacist[3] || "not_recorded",
		s4a: state.stageAttempts[4] || 0,
		s4c: state.stageAIConfidence[4] || 0,
		s4p: state.stagePharmacist[4] || "not_recorded",
	});

	try {
		fetch(`${GAS_URL}?${params.toString()}`, {
			method: "GET",
			mode: "no-cors",
			redirect: "follow",
		}).catch(() => {});

		const img = new Image();
		img.src = `${GAS_URL}?${params.toString()}&t=${Date.now()}`;
		console.log("✅ 數據已送出");
	} catch (e) {
		console.error("❌ 數據送出失敗:", e);
	}
}
