import { LintIgnoredAny } from "../stp@types";
import { LanguageCode, LanguageSourceCode } from "./types/Language";
import { SourceLanguageCode, TargetLanguageCode } from "deepl-node";

export * from "./types/Language";

export async function translate(
	text: string,
	options: {
		from?: LanguageSourceCode;
		to: LanguageCode;
	},
): Promise<string> {
	const params = new URLSearchParams({
		client: "gtx",
		sl: options.from ?? "auto",
		tl: options.to,
		dj: "1",
		dt: "t",
		ie: "UTF-8",
		q: text,
	});

	const response = await fetch(
		`https://translate.googleapis.com/translate_a/single?${params}`,
	);
	if (!response.ok) throw new Error("Translation failed");

	const json = await response.json();

	return json.sentences.map((x: LintIgnoredAny) => x.trans).join("");
}

// export async function translate2(
// 	text: string,
// 	options: {
// 		from: LanguageSourceCode;
// 		to: LanguageCode;
// 	},
// ) {
// 	const response = await fetch(
// 		`/api/translate?from=${options.from}&to=${options.to}&text=${text}`,
// 	);
// 	if (response.ok) return await response.text();
// 	throw "Error translating";
// }

export async function translate3(
	text: string,
	options: {
		from?: SourceLanguageCode;
		to: TargetLanguageCode;
	},
): Promise<string> {
	const params = new URLSearchParams({
		to: options.to,
		text: text,
	});
	if (options.from) params.set("from", options.from);
	const response = await fetch(`/api/translate?${params}`);
	if (response.ok) return await response.text();
	throw "Error translating";
}
