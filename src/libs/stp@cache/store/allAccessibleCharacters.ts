"use client";

import { CharacterData } from "@/libs/stp@types";
import { SessionCache } from "../core";

export const allAccessibleCharactersCache = new SessionCache<
	string,
	CharacterData[]
>("all-accessible-characters-cache", {
	ttlMs: 1000 * 60 * 10, // 10 minutes
});
