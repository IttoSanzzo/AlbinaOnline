"use client";

import { CharacterExpandedData } from "@/libs/stp@types";
import { SessionCache } from "../core";

export const characterDataCache = new SessionCache<
	string,
	CharacterExpandedData
>("characterDataCache", {
	ttlMs: 1000 * 60 * 60 * 24 * 30, // 1 month
});
