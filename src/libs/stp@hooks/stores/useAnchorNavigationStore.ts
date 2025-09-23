"use client";

import { create } from "zustand";

export type AnchorProps = {
	name: string;
	id: string;
	indentation?: 0 | 1 | 2;
};

export interface AnchorNavigationState {
	anchors: AnchorProps[] | null;
	isSet: boolean;
	setAnchors: (anchors: AnchorProps[]) => void;
	setIsSet: (isSet: boolean) => void;
	reset: () => void;
}

export const useAnchorNavigationStore = create<AnchorNavigationState>(
	(set) => ({
		anchors: null,
		isSet: false,
		setAnchors: (anchors) => set({ anchors }),
		setIsSet: (isSet) => set({ isSet }),

		reset: () =>
			set({
				anchors: null,
				isSet: false,
			}),
	})
);
