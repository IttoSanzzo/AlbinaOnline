import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
	const auth = request.headers.get("authorization");
	if (!auth || auth != `Bearer ${process.env.PEER_API_AUTH_SECRET}`)
		return new Response("Unauthorized", { status: 401 });

	try {
		const { tags }: { tags: string[] } = await request.json();
		if (!tags) return new Response("Missing payload", { status: 400 });
		else if (!Array.isArray(tags) || typeof tags[0] != "string")
			return new Response("Invalid payload", { status: 400 });

		for (const tag of tags) revalidateTag(tag, {});
		return new Response("Revalidated", { status: 200 });
	} catch {
		return new Response("Missing payload", { status: 400 });
	}
}
