"use client";

import { Guid } from "@/libs/stp@types";
import { useSetCurrentNpcAccessLevel } from "../hooks";

interface SetCurrentNpcAccessLevelProps {
	npcId: Guid;
}
export function SetCurrentNpcAccessLevel({
	npcId,
}: SetCurrentNpcAccessLevelProps) {
	useSetCurrentNpcAccessLevel(npcId, {
		resetOnUnmount: true,
	});
	return null;
}
