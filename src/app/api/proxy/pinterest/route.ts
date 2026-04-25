import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");
	if (!url) return new Response("Missing url", { status: 400 });

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0",
			},
		});
		if (!response.ok)
			return new Response("Failed to fetch pinterest page", { status: 400 });

		const contentType = response.headers.get("content-type") ?? "text/html";
		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch {
		return new Response("Error fetching pinterest page", { status: 500 });
	}
}
