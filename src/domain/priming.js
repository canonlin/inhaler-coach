/**
 * 開封／排氣（priming）：每支藥自己的仿單怎麼寫，就怎麼做。
 *
 * 「先噴幾次」不是一個規則，是十七支藥各自的規則。同一種裝置都不一樣：
 * Symbicort Rapihaler 新 inhaler 對空噴 2 下，40/2.25 規格是 3 下；Breztri
 * 與 Bevespi（Aerosphere）是 4 下；Trimbow 是 1 下；Ellipta 與 Breezhaler 根本
 * 沒有排氣這個步驟；Respimat 要噴到看見霧氣再多噴 3 下。把它寫成一個數字，
 * 就是把十幾支藥的用法講錯，其中幾支還剛好講反。
 *
 * 這份檔案是唯一的地方。病人端的說明、藥師端選藥時看到的提醒、測試與文件
 * 都讀它；沒有第二份。
 *
 * 每條規則都帶出處，因為「照一般 MDI 的做法」不是理由，出處才是。出處是
 * 仿單或官方用藥指引；藥師部自己印的用藥指導單張也算，因為那是本院藥師
 * 對病人的實際說法。
 *
 * 未確認的藥不會給一個猜的數字。Duasma HFA 與 Berotec N 的仿單還沒取得，
 * 它們的規則是「未確認」，畫面上會說請照仿單或藥師的指示，而不是給病人一
 * 個不知道對不對的次數。
 *
 * 資料對象的 key 與 src/domain/drugs.js 的 name 相同（試算表的 key），改那
 * 邊的 name 就要改這邊。
 */

/**
 * @typedef {object} PrimingRule
 * @property {string} key            試算表的 key（與 drugs.js 的 name 相同）
 * @property {number|null} sprays    首次使用要對空試噴幾下；null = 這支藥不需排氣
 * @property {number|null} rePrimeAfterDays  超過幾天沒用要再排氣；null = 仿單沒這條
 * @property {number|null} rePrimeSprays     再排氣要噴幾下
 * @property {boolean} shake         每次使用前要不要搖
 * @property {string} how            給病人看的一句話
 * @property {string} source         出處
 * @property {boolean} confirmed     這條是照仿單確認過的，還是待確認
 */

/**
 * @param {string} key
 * @param {number|null} sprays
 * @param {number|null} rePrimeAfterDays
 * @param {number|null} rePrimeSprays
 * @param {boolean} shake
 * @param {string} how
 * @param {string} source
 * @param {boolean} [confirmed]
 * @returns {PrimingRule}
 */
function rule(
	key,
	sprays,
	rePrimeAfterDays,
	rePrimeSprays,
	shake,
	how,
	source,
	confirmed = true,
) {
	return {
		key,
		sprays,
		rePrimeAfterDays,
		rePrimeSprays,
		shake,
		how,
		source,
		confirmed,
	};
}

/** @type {Record<string, PrimingRule>} */
export const PRIMING_RULES = {
	Symbicort: rule(
		"Symbicort",
		2,
		7,
		2,
		true,
		"第一次用先搖 5 秒、對著空氣噴 1 下，再搖 5 秒、噴 1 下（共 2 下）；超過 7 天沒用或掉了，要再做一次。",
		"Symbicort Rapihaler 仿單（新加坡 NDF 產品資訊引述核准仿單）：新 inhaler 與超過一週未用或掉落時各對空噴 2 下（40/2.25 mcg 規格新用時為 3 下）；每次使用前搖勻。",
	),

	"Seretide Evohaler": rule(
		"Seretide Evohaler",
		null,
		7,
		2,
		true,
		"第一次用先試噴到劑量計數器顯示 120；超過一週沒用，試噴 2 下。每次使用前要搖勻。",
		"Seretide Evohaler 用藥指導（台大醫院藥劑部單張）與 HPRA 病人用藥指引：首次使用試噴至計數器顯示 120；超過一週未用時試噴 2 下；每次使用前搖勻。",
	),
	"Flixotide Evohaler": rule(
		"Flixotide Evohaler",
		null,
		7,
		2,
		true,
		"第一次用先試噴到劑量計數器顯示 120；超過一週沒用，試噴 2 下。每次使用前要搖勻。",
		"與 Seretide Evohaler 同一個 Evohaler 裝置，計數器與排氣規則相同；Flixotide Evohaler 用藥指導單張。",
	),

	"Duasma HFA": rule(
		"Duasma HFA",
		null,
		null,
		null,
		true,
		"這支藥的排氣次數還沒有確認，請照仿單或藥師的指示做。",
		"仿單尚未取得（品項清單註記「懸浮／溶液待確認」）。未確認前不給次數。",
		false,
	),

	Breztri: rule(
		"Breztri",
		4,
		7,
		2,
		true,
		"第一次用對著空氣噴 4 下（每下前先搖）；超過 7 天沒用、摔過、或每週清洗後，再噴 2 下。",
		"Breztri Aerosphere 處方資訊（GSK）：首次使用前對空噴 4 下；超過 7 天未用、掉落或每週用清水沖洗吸嘴後，再對空噴 2 下；每次使用前搖勻。",
	),

	Trimbow: rule(
		"Trimbow",
		1,
		null,
		null,
		false,
		"第一次用先對空噴 1 下，讓計數器從 121 跳到 120。這支藥是溶液型，不用搖。",
		"Trimbow（喘寶）定量吸入劑用藥指導（台北醫學大學附設醫院、桃園長庚醫院）：第一次使用吸入器之前應排空一劑藥物至空氣中，計數器由 121 跳至 120；溶液型不需搖晃。",
	),

	Bevespi: rule(
		"Bevespi",
		4,
		7,
		2,
		true,
		"第一次用對著空氣噴 4 下（每下前先搖）；超過 7 天沒用、摔過、放到低溫或清洗過，再噴 2 下。",
		"Bevespi Aerosphere 處方資訊（GSK）：首次使用前對空噴 4 下；超過 7 天未用、掉落、置於低溫或清洗後，再對空噴 2 下；每次使用前搖勻。",
	),

	"Berotec N": rule(
		"Berotec N",
		null,
		null,
		null,
		true,
		"這支藥的排氣次數還沒有確認，請照仿單或藥師的指示做。",
		"仿單尚未取得（品項清單註記「懸浮／溶液待確認」）。未確認前不給次數。",
		false,
	),

	Ventolin: rule(
		"Ventolin",
		2,
		5,
		2,
		true,
		"第一次用搖勻後對著空氣噴 2 下；超過 5 天沒用，也要搖勻再噴 2 下。",
		"Ventolin Inhaler (CFC-free) 用藥指引（Medsafe 資料表／GSK 病人用藥指引）：首次使用前搖勻並對空噴 2 下；超過 5 天未用時搖勻再對空噴 2 下。",
	),

	"Relvar (Ellipta)": rule(
		"Relvar (Ellipta)",
		null,
		null,
		null,
		false,
		"不用排氣也不用搖。打開蓋子聽到喀一聲，藥就裝好了，直接吸。",
		"Ellipta 吸入器使用說明（GSK）：打開蓋子即完成劑量裝填，不需要排氣，也不需要搖晃。",
	),
	"Trelegy 92/55/22 (Ellipta)": rule(
		"Trelegy 92/55/22 (Ellipta)",
		null,
		null,
		null,
		false,
		"不用排氣也不用搖。打開蓋子聽到喀一聲，藥就裝好了，直接吸。",
		"與 Relvar Ellipta 同一個 Ellipta 裝置：打開蓋子即完成裝填，不需要排氣或搖晃。",
	),
	"Trelegy 184/55/22 (Ellipta)": rule(
		"Trelegy 184/55/22 (Ellipta)",
		null,
		null,
		null,
		false,
		"不用排氣也不用搖。打開蓋子聽到喀一聲，藥就裝好了，直接吸。",
		"與 Relvar Ellipta 同一個 Ellipta 裝置：打開蓋子即完成裝填，不需要排氣或搖晃。",
	),
	"Anoro (Ellipta)": rule(
		"Anoro (Ellipta)",
		null,
		null,
		null,
		false,
		"不用排氣也不用搖。打開蓋子聽到喀一聲，藥就裝好了，直接吸。",
		"與 Relvar Ellipta 同一個 Ellipta 裝置：打開蓋子即完成裝填，不需要排氣或搖晃。",
	),

	"Ultibro Breezhaler": rule(
		"Ultibro Breezhaler",
		null,
		null,
		null,
		false,
		"不用排氣。把膠囊放進去、刺破一次就直接吸；吸完看看囊內還有沒有粉末，還有就關上再吸一次。",
		"Ultibro Breezhaler 產品資訊（Novartis）：膠囊只需刺破一次；吸完檢查囊內是否仍有粉末，若有則重複吸入步驟。沒有排氣步驟。",
	),

	"Spiolto Respimat": rule(
		"Spiolto Respimat",
		4,
		3,
		1,
		false,
		"第一次用先轉開蓋子按到底，噴到看見霧氣為止，再這樣做 3 次（共 4 下）；超過 3 天沒用先噴 1 下，超過 21 天沒用要重新初始化。",
		"STIOLTO RESPIMAT 處方資訊（Boehringer Ingelheim，2025）：初次使用噴至看見霧氣後再重複三次；超過 3 天未用先噴一下，超過 21 天未用須重新初始化。",
	),
	"Striverdi Respimat": rule(
		"Striverdi Respimat",
		4,
		3,
		1,
		false,
		"第一次用先轉開蓋子按到底，噴到看見霧氣為止，再這樣做 3 次（共 4 下）；超過 3 天沒用先噴 1 下，超過 21 天沒用要重新初始化。",
		"SPIRIVA RESPIMAT 處方資訊（Boehringer Ingelheim）：初次使用噴至看見霧氣後再重複三次；超過 3 天未用先噴一下，超過 21 天未用須重新初始化。",
	),
	"Spiriva Respimat": rule(
		"Spiriva Respimat",
		4,
		3,
		1,
		false,
		"第一次用先轉開蓋子按到底，噴到看見霧氣為止，再這樣做 3 次（共 4 下）；超過 3 天沒用先噴 1 下，超過 21 天沒用要重新初始化。",
		"SPIRIVA RESPIMAT 處方資訊（Boehringer Ingelheim）：初次使用噴至看見霧氣後再重複三次；超過 3 天未用先噴一下，超過 21 天未用須重新初始化。",
	),
};

/**
 * The rule for a product.
 *
 * An unknown or unconfirmed product gets the unconfirmed rule rather than a
 * guess: telling a patient to prime an inhaler that does not need priming
 * wastes a dose, and telling them not to prime one that does is worse.
 *
 * @param {string} key the spreadsheet key of the product
 * @returns {PrimingRule}
 */
export function primingFor(key) {
	return (
		PRIMING_RULES[key] ??
		rule(
			key,
			null,
			null,
			null,
			true,
			"這支藥的排氣次數還沒有確認，請照仿單或藥師的指示做。",
			"這支藥不在已確認清單內。",
			false,
		)
	);
}

/**
 * Does this product prime at all?
 *
 * @param {string} key
 * @returns {boolean}
 */
export function needsPriming(key) {
	const r = primingFor(key);
	return r.confirmed && r.sprays !== null;
}

/**
 * The products whose rules are still to be confirmed.
 *
 * @returns {string[]}
 */
export function unconfirmedProducts() {
	return Object.values(PRIMING_RULES)
		.filter((r) => !r.confirmed)
		.map((r) => r.key);
}
