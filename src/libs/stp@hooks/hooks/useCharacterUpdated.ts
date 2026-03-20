"use client";

import { useEffect } from "react";
import { eventBus } from "../classes";

export function useCharacterUpdated(
	characterId: string,
	callback: (data: { updatedAt: string }) => boolean | Promise<boolean>,
) {
	useEffect(() => {
		const unsubscribe = eventBus.on(`/chars/${characterId}/updated`, callback);
		return unsubscribe;
	}, [characterId, callback]);
}
