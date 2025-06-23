"use client";

import {
	ItemData,
	MasteryData,
	RaceData,
	SkillData,
	SpellData,
	TraitData,
} from "@/libs/stp@types";
import { create } from "zustand";

export type PageDataType =
	| null
	| "Character"
	| "Item"
	| "Mastery"
	| "Skill"
	| "Spell"
	| "Trait"
	| "Race";

export type PageData =
	| null
	| ItemData
	| MasteryData
	| SkillData
	| SpellData
	| TraitData
	| RaceData;

export interface CurrentPageDataState {
	type: PageDataType;
	data: PageData;
	isSet: boolean;
	setType: (type: PageDataType) => void;
	setData: (data: PageData) => void;
	setIsSet: (isSet: boolean) => void;
	reset: () => void;
}

export const useCurrentPageDataStore = create<CurrentPageDataState>((set) => ({
	type: null,
	data: null,
	isSet: false,
	setType: (type) => set({ type }),
	setData: (data) => set({ data }),
	setIsSet: (isSet) => set({ isSet }),

	reset: () =>
		set({
			type: null,
			data: null,
			isSet: false,
		}),
}));
