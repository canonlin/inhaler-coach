/**
 * How often would the ▲ 頑固 mark fire on a step that actually improved?
 *
 * The original dashboard marks a step ▲ when its post-intervention error rate
 * is still >= 25%. That mark is a claim: 「這一項沒被處理好」. A mark that
 * appears when the step in fact improved by half is worse than no mark, because
 * it sends the pharmacist to re-teach something that is already fixed.
 *
 * So the question is not "how likely is >=25% by chance" but "if this step
 * really did improve to X, how often would we still see >=25%". That is a false
 * alarm rate, and it depends on the denominator.
 *
 * Read: pick the smallest n whose false-alarm rate is acceptable, and refuse to
 * mark anything below it. Cells under it print 資料不足 rather than a symbol.
 */
function pAtLeast(k, n, p) {
	let total = 0;
	for (let i = k; i <= n; i += 1) {
		let c = 1;
		for (let j = 0; j < i; j += 1) c = (c * (n - j)) / (j + 1);
		total += c * p ** i * (1 - p) ** (n - i);
	}
	return total;
}

const MARK = 0.25;
console.log("▲ 頑固 = 改善後錯誤率仍 >= 25%\n");
for (const [label, improvedTo] of [
	["真實改善到 10%（介入有效）", 0.1],
	["真實改善到 15%", 0.15],
	["真實改善到 20%", 0.2],
]) {
	console.log(`── ${label} ──`);
	console.log(["n", "需 >= k 人錯", "誤標機率"].join("\t"));
	for (const n of [8, 10, 12, 15, 18, 20, 25, 30, 40]) {
		const k = Math.ceil(MARK * n);
		const p = pAtLeast(k, n, improvedTo);
		console.log([n, `${k}/${n}`, p.toFixed(3)].join("\t"));
	}
	console.log();
}