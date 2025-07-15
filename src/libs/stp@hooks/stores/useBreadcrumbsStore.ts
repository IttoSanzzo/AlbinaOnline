"use client";

import { create } from "zustand";

export type Breadcrumb = {
	name: string;
	href: string;
	icon?: string;
};

interface BreadcrumbsState {
	breadcrumbs: Breadcrumb[];
	isSet: boolean;
	setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
	setIsSet: (isSet: boolean) => void;
	clearBreadcrumbs: () => void;
}

export const useBreadcrumbsStore = create<BreadcrumbsState>((set) => ({
	breadcrumbs: [],
	isSet: false,
	setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
	setIsSet: (isSet) => set({ isSet }),
	clearBreadcrumbs: () => {
		set({ breadcrumbs: [], isSet: false });
	},
}));
