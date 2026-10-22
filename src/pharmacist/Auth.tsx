/**
 * The back office's sign-in.
 *
 * The patient end has no login and never will: it is a browser, a camera and
 * a checklist, and asking for a password would cost the one thing the project
 * is trying not to cost. The back office is the opposite — it reads record
 * numbers, exports the study sheet and changes what the hospital teaches — so
 * it asks for an account and the server checks one.
 *
 * The session itself is an HttpOnly cookie. This component never sees the
 * token, which is the point: a script that could read it could also steal it.
 */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { API_BASE, onUnauthorized } from "../api-client";

export interface AdminUser {
	id: string;
	email: string;
	displayName: string;
	role: "admin" | "pharmacist" | "viewer";
}

type Status = "checking" | "signed-out" | "signed-in";

interface AuthValue {
	user: AdminUser | null;
	status: Status;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/** The signed-in account, or null. Throws outside the provider. */
export function useAuth(): AuthValue {
	const value = useContext(AuthContext);
	if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
	return value;
}

async function readJson(res: Response) {
	const json = await res.json().catch(() => ({}));
	return json as {
		ok?: boolean;
		error?: string;
		signedIn?: boolean;
		user?: AdminUser;
	};
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AdminUser | null>(null);
	const [status, setStatus] = useState<Status>("checking");

	// The session can end mid-shift. Any request that comes back 401 says so,
	// and the app drops back to the sign-in screen rather than showing a page
	// full of failed loads.
	useEffect(() => {
		onUnauthorized(() => {
			setUser(null);
			setStatus("signed-out");
		});
	}, []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`${API_BASE}/api/auth/me`, {
					credentials: "same-origin",
				});
				const json = await readJson(res);
				if (cancelled) return;
				if (res.ok && json.signedIn && json.user) {
					setUser(json.user);
					setStatus("signed-in");
				} else {
					setUser(null);
					setStatus("signed-out");
				}
			} catch {
				if (!cancelled) {
					setUser(null);
					setStatus("signed-out");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const signIn = useCallback(async (email: string, password: string) => {
		const res = await fetch(`${API_BASE}/api/auth/login`, {
			method: "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const json = await readJson(res);
		if (!res.ok || !json.signedIn || !json.user) {
			throw new Error(json.error ?? "登入失敗");
		}
		setUser(json.user);
		setStatus("signed-in");
	}, []);

	const signOut = useCallback(async () => {
		try {
			await fetch(`${API_BASE}/api/auth/logout`, {
				method: "POST",
				credentials: "same-origin",
			});
		} catch {
			// The cookie is cleared by the server. If the network is down the
			// local state still has to change, or the screen lies about who is
			// signed in.
		}
		setUser(null);
		setStatus("signed-out");
	}, []);

	const value = useMemo(
		() => ({ user, status, signIn, signOut }),
		[user, status, signIn, signOut],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * The gate.
 *
 * While the session is being checked it shows nothing but a line of text, so
 * the first paint of a signed-in pharmacist is the work, not a form they have
 * to dismiss.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
	const { status } = useAuth();

	if (status === "checking") {
		return (
			<div className="surface-admin flex min-h-dvh items-center justify-center bg-bg">
				<p className="text-text-secondary">正在確認身分…</p>
			</div>
		);
	}

	if (status === "signed-out") {
		return <LoginScreen />;
	}

	return <>{children}</>;
}

/**
 * The sign-in screen.
 *
 * It is deliberately plain: a hospital counter tablet, a busy morning, and a
 * pharmacist who has to sign in between patients. Two fields, one button, and
 * the reason a refusal failed said out loud.
 */
function LoginScreen() {
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	const submit = async (event: React.FormEvent) => {
		event.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await signIn(email.trim(), password);
		} catch (err) {
			setError(err instanceof Error ? err.message : "登入失敗");
			setPassword("");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="surface-admin flex min-h-dvh items-center justify-center bg-bg px-4">
			<main className="w-full max-w-sm rounded-lg border border-border-subtle bg-surface p-7 shadow-sm">
				<h1 className="text-xl font-bold tracking-tight text-primary">
					智慧呼吸照護平台
				</h1>
				<p className="mt-1 text-caption text-text-muted">
					QCC 吸入劑衛教 · 藥師工作區
				</p>

				<form className="mt-6 space-y-4" onSubmit={submit}>
					<div>
						<label
							className="block text-sm font-semibold text-text-secondary"
							htmlFor="signin-email"
						>
							帳號
						</label>
						<input
							id="signin-email"
							type="email"
							autoComplete="username"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-text focus-visible:outline-2 focus-visible:outline-ring"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-semibold text-text-secondary"
							htmlFor="signin-password"
						>
							密碼
						</label>
						<input
							id="signin-password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-text focus-visible:outline-2 focus-visible:outline-ring"
						/>
					</div>

					{error && (
						<p
							role="alert"
							className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2 text-sm font-semibold text-danger"
						>
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={busy}
						className="w-full rounded-md bg-primary px-4 py-2.5 text-base font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
					>
						{busy ? "登入中…" : "登入"}
					</button>
				</form>

				<p className="mt-5 border-t border-border-subtle pt-4 text-caption leading-relaxed text-text-muted">
					註：帳號由藥劑部管理員開通。若連續嘗試失敗，帳號會暫時鎖定 15 分鐘。
				</p>
			</main>
		</div>
	);
}

/**
 * Who is signed in, and the way out.
 *
 * The name is in the navigation because a shared tablet has more than one
 * user over a day, and "who is this data attributed to" has to be answerable
 * at a glance.
 */
export function SignedInAs() {
	const { user, signOut } = useAuth();
	if (!user) return null;
	return (
		<div className="mt-auto bg-surface-muted px-4 py-3">
			<p className="truncate text-sm font-semibold text-text">
				{user.displayName}
			</p>
			{/* text-secondary, not text-muted: the muted band is darker than
			    the surface, and muted grey on it lands at 4.34:1 — under the
			    4.5:1 that small text owes its reader. */}
			<p className="truncate text-caption text-text-secondary">{user.email}</p>
			<button
				type="button"
				onClick={() => void signOut()}
				className="mt-2 text-caption font-semibold text-primary underline-offset-2 hover:underline"
			>
				登出
			</button>
		</div>
	);
}
