import { ReactNode } from "react";
import { create } from "zustand";

export type NavBarModuleKey = string | "FavoriteModule" | "ContextMenuModule";

interface NavBarModulesState {
	modules: Record<NavBarModuleKey, () => ReactNode>;
	setModule: (key: NavBarModuleKey, component: () => ReactNode) => void;
	removeModule: (key: NavBarModuleKey) => void;
	clearModules: () => void;
}

export const useNavBarModulesStore = create<NavBarModulesState>((set) => ({
	modules: {},
	setModule: (key, component) =>
		set((state) => ({
			modules: {
				...state.modules,
				[key]: component,
			},
		})),
	removeModule: (key) =>
		set((state) => {
			const newModules = { ...state.modules };
			delete newModules[key];
			return { modules: newModules };
		}),
	clearModules: () => set({ modules: {} }),
}));
