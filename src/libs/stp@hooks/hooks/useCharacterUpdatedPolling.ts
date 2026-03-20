"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useEffect, useRef } from "react";
import { eventBus } from "../classes";
import toast from "react-hot-toast";

export function useCharacterUpdatedPolling(
	characterId: string,
	updatedAt: string = "",
) {
	const lastUpdatedAt = useRef<string>(updatedAt);

	useEffect(() => {
		const interval = setInterval(async () => {
			const response = await authenticatedFetchAsync(
				getAlbinaApiFullAddress(`/chars/${characterId}/updated-at`),
				{ method: "GET" },
			);
			if (response.ok == false) return;
			const data = await response.json();
			if (lastUpdatedAt.current == "") lastUpdatedAt.current = data.updatedAt;
			else if (lastUpdatedAt.current !== data.updatedAt) {
				const toastId = toast.loading("Sincronizando dados...");
				const eventWasSuccess = await eventBus.emitAsync(
					`/chars/${characterId}/updated`,
					{
						updatedAt: data.updatedAt,
					},
				);
				if (eventWasSuccess) {
					toast.success("Sincronizado", { id: toastId });
					lastUpdatedAt.current = data.updatedAt;
				} else {
					toast.error("Sincronização falhou", { id: toastId });
				}
			}
		}, 5 * 1000);
		return () => clearInterval(interval);
	}, [characterId]);
}
