"use client";

import { LintIgnoredAny } from "@/libs/stp@types";
import { create } from "zustand";

export interface DiscordWidgetState {
	isSet: boolean;
	discordWidget: LintIgnoredAny | null;
	setIsSet: (isSet: boolean) => void;
	setDiscordWidget: (discordWidget: object) => void;
}

export const useDiscordWidgetStore = create<DiscordWidgetState>((set) => ({
	isSet: false,
	discordWidget: null,
	setIsSet: (isSet) => set({ isSet }),
	setDiscordWidget: (discordWidget) => set({ discordWidget }),
}));
