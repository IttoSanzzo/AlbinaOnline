"use client";

import { Guid } from "@/libs/stp@types";
import { useSetCurrentCharacterAccessLevel } from "../hooks";

interface SetCurrentCharacterAccessLevelProps {
	characterId: Guid;
}
export function SetCurrentCharacterAccessLevel({
	characterId,
}: SetCurrentCharacterAccessLevelProps) {
	useSetCurrentCharacterAccessLevel(characterId, {
		resetOnUnmount: true,
	});
	return null;
}
