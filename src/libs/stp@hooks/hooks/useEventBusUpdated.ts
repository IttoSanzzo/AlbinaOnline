"use client";

import { useEffect } from "react";
import { eventBus } from "../classes";
import { LintIgnoredAny } from "@/libs/stp@types";

export function useEventBusUpdated(
	key: string,
	callback: (data: LintIgnoredAny) => boolean | Promise<boolean>,
) {
	useEffect(() => {
		const unsubscribe = eventBus.on(key, callback);
		return unsubscribe;
	}, [key, callback]);
}
