"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useEffect, useRef } from "react";
import { eventBus } from "../classes";
import toast from "react-hot-toast";

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

		const init = async () => {
			const initial = await loadUpdatedAt();
			if (isMounted) lastUpdatedAt.current = initial;
		};

		const tick = async () => {
			if (isFetching) return;
			isFetching = true;

			try {
				const updatedAt = await loadUpdatedAt();
				if (!isMounted) return;
				if (
					lastUpdatedAt.current &&
					updatedAt &&
					lastUpdatedAt.current !== updatedAt
				) {
					// const toastId = toast.loading("Sincronizando dados...");
					const success = await eventBus.emitAsync(
						`/chars/${characterId}/updated`,
						{ updatedAt },
					);
					if (!isMounted) return;
					if (success) {
						// toast.success("Sincronizado", { id: toastId });
						lastUpdatedAt.current = updatedAt;
					} else {
						toast.error("Sincronização falhou");
						// toast.error("Sincronização falhou", { id: toastId });
					}
				}
			} finally {
				isFetching = false;
			}
		};

		init();
		const interval = setInterval(tick, 5000);
		return () => {
			isMounted = false;
			clearInterval(interval);
		};
	}, [characterId]);
}
