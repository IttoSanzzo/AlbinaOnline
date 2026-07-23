import { NextRequest, NextResponse } from "next/server";
import * as deepl from "deepl-node";

const authKey = process.env.DEEPL_API_TOKEN as string;
if (!authKey) throw 'Missing "DEEPL_API_TOKEN" on env.';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const from: deepl.SourceLanguageCode | null =
		(searchParams.get("from") as deepl.SourceLanguageCode) ?? null;
	const to: deepl.TargetLanguageCode =
		(searchParams.get("to") as deepl.TargetLanguageCode) ?? "en-US";
	const text = searchParams.get("text");
	if (!text)
		return NextResponse.json(
			{ error: "Missing text" },
			{
				status: 400,
			},
		);

	try {
		const result = await deeplTranslate(text, {
			from: from,
			to: to,
		});
		return new NextResponse(result, {
			headers: {
				"Content-Type": "text/html",
			},
		});
	} catch {
		return new Response("Error translating", { status: 500 });
	}
}

export async function deeplTranslate(
	text: string,
	options: {
		from?: deepl.SourceLanguageCode;
		to: deepl.TargetLanguageCode;
	},
) {
	const deepClient = new deepl.DeepLClient(authKey);

	const response = await deepClient.translateText(
		text,
		options.from ?? null,
		options.to,
	);
	return response.text;
}
