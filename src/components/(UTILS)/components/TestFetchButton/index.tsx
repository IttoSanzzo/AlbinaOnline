"use client";

import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { TestFetchButtonContainer } from "./styledElements";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useUserFavorites } from "@/libs/stp@hooks";

export function TestFetchButton() {
	const { reloadFavorites } = useUserFavorites();

	async function testFetch() {
		console.log("Testing Fetch!");

		const body = {
			type: "Item",
			newOrder: [1, 0],
		};

		const response = await authenticatedFetchAsync(
			`${getAlbinaApiAddress()}/users/me/favorites/reorder`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify(body),
			}
		);
		console.log(response.status);
		if (response.status != 405) {
			const contentLength = response.headers.get("content-length");
			const hasBody = contentLength && parseInt(contentLength) > 0;
			if (hasBody) {
				const data = await response.json();
				if (data) console.log(data);
			}
		}
		if (response.ok) await reloadFavorites();
	}

	return (
		<TestFetchButtonContainer>
			<button onClick={testFetch}>Test Fetch</button>
		</TestFetchButtonContainer>
	);
}
