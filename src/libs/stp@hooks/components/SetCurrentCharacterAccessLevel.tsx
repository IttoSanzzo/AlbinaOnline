"use client";

import { useSetCurrentCharacterAccessLevel } from "../hooks";

interface SetCurrentCharacterAccessLevelProps {
	characterId: string;
}
export function SetCurrentCharacterAccessLevel({
	characterId,
}: SetCurrentCharacterAccessLevelProps) {
	useSetCurrentCharacterAccessLevel(characterId, {
		resetOnUnmount: true,
	});
	return null;
}
