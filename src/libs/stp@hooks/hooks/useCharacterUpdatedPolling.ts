"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useEffect, useRef } from "react";
import { eventBus } from "../classes";
import toast from "react-hot-toast";
import { characterDataCache } from "@/libs/stp@cache";

async function emitUpdateSignalAsync(characterId: string, updatedAt: string) {
	return await eventBus.emitAsync(`/chars/${characterId}/updated`, {
		updatedAt,
	});
}

export function useCharacterUpdatedPolling(characterId: string) {
	const lastUpdatedAt = useRef<string | null>(null);

	async function loadUpdatedAt(): Promise<string | null> {
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/updated-at`),
			{ method: "GET" },
		);
		if (!response.ok) return null;
		const data = await response.json();
		return data.updatedAt;
	}

	useEffect(() => {
		let isMounted = true;
		let isFetching = false;

		async function init() {
			if (isMounted) {
				const characterData = characterDataCache.get(characterId);
				const updatedAt = await loadUpdatedAt();
				if (updatedAt && characterData && characterData.updatedAt != updatedAt)
					emitUpdateSignalAsync(characterId, updatedAt);
				lastUpdatedAt.current = updatedAt;
			}
		}
		init();

		async function tick() {
			if (isFetching) return;
			isFetching = true;

			try {
				const updatedAt = await loadUpdatedAt();
				if (!isMounted) return;
				if (updatedAt && lastUpdatedAt.current !== updatedAt) {
					const success = await emitUpdateSignalAsync(characterId, updatedAt);
					if (!isMounted) return;
					if (success) lastUpdatedAt.current = updatedAt;
					else toast.error("Sincronização falhou");
				}
			} finally {
				isFetching = false;
			}
		}

		const interval = setInterval(tick, 5000);
		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, [characterId]);
}
