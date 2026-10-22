/**
 * Create or update a back-office account.
 *
 * There is no sign-up form: a pharmacist is added by someone who already has
 * the console. This script is that door.
 *
 *   node scripts/admin-user.mjs --email pharmacist@yunlin.org.tw --name "王小明"
 *   node scripts/admin-user.mjs --email lead@yunlin.org.tw --name "李主任" --role admin
 *   node scripts/admin-user.mjs --list
 *
 * The password is never taken as an argument — an argument lands in the shell
 * history and in the process list. It is read from stdin, from the
 * ADMIN_PASSWORD environment variable, or typed at a masked prompt.
 */

import { stdin as stdinStream } from "node:process";
import { createInterface } from "node:readline";
import { purgeExpiredSessions, upsertAdminUser } from "../api/auth.mjs";
import { createPool } from "../api/db.mjs";

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const flagValue = (flag) => {
	const i = args.indexOf(flag);
	return i >= 0 ? args[i + 1] : undefined;
};

const URL = process.env.DATABASE_URL;
if (!URL) {
	console.error("DATABASE_URL 未設定。");
	process.exit(1);
}

const pool = createPool(URL);
const query = (text, params) => pool.query(text, params);

if (has("--list")) {
	const { rows } = await query(
		`SELECT email, display_name, role, active, last_login_at,
		        locked_until FROM admin_users ORDER BY email`,
	);
	if (!rows.length) console.log("尚無帳號。");
	for (const r of rows) {
		const state = !r.active
			? "停用"
			: r.locked_until && new Date(r.locked_until) > new Date()
				? `鎖定至 ${new Date(r.locked_until).toLocaleString("zh-TW")}`
				: "可用";
		console.log(
			`${r.email}\t${r.display_name}\t${r.role}\t${state}\t${
				r.last_login_at
					? `上次登入 ${new Date(r.last_login_at).toLocaleString("zh-TW")}`
					: "從未登入"
			}`,
		);
	}
	await pool.end();
	process.exit(0);
}

if (has("--purge-expired-sessions")) {
	const n = await purgeExpiredSessions(query);
	console.log(`已清除 ${n} 個過期 session。`);
	await pool.end();
	process.exit(0);
}

const email = flagValue("--email");
const name = flagValue("--name");
const role = flagValue("--role") ?? "pharmacist";

if (!email || !name) {
	console.error(
		"用法：node scripts/admin-user.mjs --email <address> --name <顯示名稱> [--role admin|pharmacist|viewer]",
	);
	await pool.end();
	process.exit(2);
}

const password = await readPassword();
if (!password) {
	console.error("沒有讀到密碼。");
	await pool.end();
	process.exit(2);
}

try {
	const user = await upsertAdminUser(query, {
		email,
		password,
		displayName: name,
		role,
	});
	console.log(
		`已設定帳號：${user.email}（${user.display_name}，${user.role}）`,
	);
} catch (err) {
	console.error(`設定失敗：${err.message}`);
	await pool.end();
	process.exit(1);
}

await pool.end();

/**
 * Read the password without leaving it in the shell history.
 *
 * stdin wins when it is not a terminal, so a pipe or a heredoc works in a
 * script; otherwise the operator is asked, with echo off.
 */
async function readPassword() {
	if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
	if (!stdinStream.isTTY) {
		const chunks = [];
		for await (const c of stdinStream) chunks.push(c);
		return Buffer.concat(chunks)
			.toString("utf8")
			.replace(/\r?\n$/, "");
	}
	const rl = createInterface({ input: stdinStream, output: process.stdout });
	// The prompt is written directly so the answer is not echoed.
	process.stdout.write("密碼（至少 12 個字元，不會顯示）：");
	const answer = await new Promise((resolve) => rl.question("", resolve));
	rl.close();
	process.stdout.write("\n");
	return answer;
}
