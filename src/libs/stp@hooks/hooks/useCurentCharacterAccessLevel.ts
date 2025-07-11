"use client";

import { useEffect } from "react";
import { useCurrentCharacterAccessLevelStore } from "../stores";
import { useShallow } from "zustand/shallow";

export function useCurrentCharacterAccessLevel() {
	return useCurrentCharacterAccessLevelStore(
		useShallow((state) => ({
			accessLevel: state.accessLevel,
			setAccessLevel: state.setAccessLevel,
			isSet: state.isSet,
			setIsSet: state.setIsSet,
			clearAccessLevel: state.clearAccessLevel,
		}))
	);
}

export function useSetCurrentCharacterAccessLevel(
	characterId: string,
	options?: { resetOnUnmount?: boolean }
) {
	const { fetchAccessLevel, clearAccessLevel } =
		useCurrentCharacterAccessLevelStore(
			useShallow((state) => ({
				clearAccessLevel: state.clearAccessLevel,
				fetchAccessLevel: state.fetchAccessLevel,
			}))
		);
	useEffect(() => {
		fetchAccessLevel(characterId);
		return () => {
			if (options?.resetOnUnmount) {
				clearAccessLevel();
			}
		};
	}, [characterId]);
}
