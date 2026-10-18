/**
 * LIFF context: who opened this page.
 *
 * The pages work in three situations: inside LINE (real context), in a
 * browser during development (`?dev_user=` only, and only for DEV builds),
 * and in a plain browser (no identity — registration refuses to submit and
 * says so, rather than posting an anonymous record).
 *
 * Source of the LIFF ID: the pharmacist's frontend (app.js → LIFF_ID).
 */

const LIFF_ID = "2011015708-D1UWKfbr";
const SDK_URL = "https://static.line-scdn.net/liff/edge/2/sdk.js";

export interface LiffContext {
	/** LINE user id. Null outside LINE without a dev override. */
	userId: string | null;
	/** ID token for the backend, when the SDK provided one. */
	idToken: string | null;
	inLineClient: boolean;
}

declare global {
	interface Window {
		liff?: {
			init: (cfg: { liffId: string }) => Promise<void>;
			isInClient: () => boolean;
			getContext?: () => { userId?: string };
			getIDToken?: () => string | null;
		};
	}
}

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
	if (window.liff) return Promise.resolve();
	if (!sdkPromise) {
		sdkPromise = new Promise((resolve, reject) => {
			const el = document.createElement("script");
			el.src = SDK_URL;
			el.onload = () => resolve();
			el.onerror = () =>
				reject(new Error("LIFF SDK 載入失敗，請檢查網路後重試。"));
			document.head.appendChild(el);
		});
	}
	return sdkPromise;
}

/** Never throws: no identity is a normal state, reported as nulls. */
export async function getLiffContext(): Promise<LiffContext> {
	if (import.meta.env.DEV) {
		const dev = new URLSearchParams(window.location.search).get("dev_user");
		if (dev) return { userId: dev, idToken: null, inLineClient: false };
	}
	try {
		await loadSdk();
		const liff = window.liff;
		if (!liff) return { userId: null, idToken: null, inLineClient: false };
		await liff.init({ liffId: LIFF_ID });
		const inLineClient = liff.isInClient();
		const userId = liff.getContext?.()?.userId ?? null;
		const idToken = liff.getIDToken?.() ?? null;
		return { userId, idToken, inLineClient };
	} catch {
		return { userId: null, idToken: null, inLineClient: false };
	}
}
