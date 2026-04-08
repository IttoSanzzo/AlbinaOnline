"use client";

import { useEffect } from "react";
import { eventBus } from "../classes";

export function useNpcUpdated(
	npcId: string,
	callback: (data: { updatedAt: string }) => boolean | Promise<boolean>,
) {
	useEffect(() => {
		const unsubscribe = eventBus.on(`/npcs/${npcId}/updated`, callback);
		return unsubscribe;
	}, [npcId, callback]);
}
