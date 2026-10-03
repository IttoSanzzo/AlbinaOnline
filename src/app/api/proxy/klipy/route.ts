import { NextRequest } from "next/server";

interface KlipyGifResult {
	media_formats?: {
		gif?: {
			url?: string;
			dims?: [number, number];
		};
	};
}

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams.get("query");
	if (!query) return new Response("Missing query", { status: 400 });

	try {
		const url = new URL("https://api.klipy.com/v2/search");
		url.searchParams.set("key", process.env.KLIPY_API_KEY!);
		url.searchParams.set("q", query);
		url.searchParams.set("media_filter", "gif");
		url.searchParams.set("limit", "50");

		const response = await fetch(url);

		if (!response.ok)
			return new Response("Error fetching gifs", {
				status: response.status,
			});

		const data = await response.json();

		const gifs = data.results
			.map((result: KlipyGifResult) => {
				const gif = result.media_formats?.gif;

				if (!gif?.url || !gif.dims) return null;

				return {
					url: gif.url,
					width: gif.dims[0],
					height: gif.dims[1],
				};
			})
			.filter(
				(
					gif: {
						url: string;
						width: number;
						height: number;
					} | null,
				): gif is {
					url: string;
					width: number;
					height: number;
				} => gif != null,
			);

		return Response.json(gifs);
	} catch {
		return new Response("Error fetching gifs", { status: 500 });
	}
}
