"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useUserFavorites } from "@/libs/stp@hooks";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const TestFetchButtonContainer = newStyledElement.div(
	styles.testFetchButtonContainer,
);

export function TestFetchButton() {
	const { reloadFavorites } = useUserFavorites();

	async function testFetch() {
		const body = {
			type: "Item",
			newOrder: [1, 0],
		};

		const response = await authenticatedFetchAsync(
			`${getAlbinaApiFullAddress()}/users/me/favorites/reorder`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify(body),
			},
		);
		if (response.ok) await reloadFavorites();
	}

	return (
		<TestFetchButtonContainer>
			<button onClick={testFetch}>Test Fetch</button>
		</TestFetchButtonContainer>
	);
}
