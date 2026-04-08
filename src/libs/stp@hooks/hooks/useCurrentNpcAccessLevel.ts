"use client";

import { useEffect } from "react";
import { useCurrentNpcAccessLevelStore } from "../stores";
import { useShallow } from "zustand/shallow";
import { Guid } from "@/libs/stp@types";

export function useCurrentNpcAccessLevel() {
	return useCurrentNpcAccessLevelStore(
		useShallow((state) => ({
			accessLevel: state.accessLevel,
			setAccessLevel: state.setAccessLevel,
			isSet: state.isSet,
			setIsSet: state.setIsSet,
			clearAccessLevel: state.clearAccessLevel,
		})),
	);
}

export function useSetCurrentNpcAccessLevel(
	npcId: Guid,
	options?: { resetOnUnmount?: boolean },
) {
	const { fetchAccessLevel, clearAccessLevel } = useCurrentNpcAccessLevelStore(
		useShallow((state) => ({
			clearAccessLevel: state.clearAccessLevel,
			fetchAccessLevel: state.fetchAccessLevel,
		})),
	);
	useEffect(() => {
		fetchAccessLevel(npcId);
		return () => {
			if (options?.resetOnUnmount) {
				clearAccessLevel();
			}
		};
	}, [npcId]);
}
