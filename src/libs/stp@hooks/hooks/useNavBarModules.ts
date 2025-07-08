"use client";

import { useShallow } from "zustand/shallow";
import { useNavBarModulesStore } from "../stores/useNavBarModulesStore";
import { ReactNode, useEffect } from "react";

export function useNavBarModules() {
	return useNavBarModulesStore(
		useShallow((state) => ({
			modules: state.modules,
			setModule: state.setModule,
			removeModule: state.removeModule,
			clearModules: state.clearModules,
		}))
	);
}

export function useSetNavBarModulesStore(
	favoriteButton?: () => ReactNode,
	contextMenuButton?: () => ReactNode,
	options?: { resetOnUnmount?: boolean }
) {
	const { modules, setModule, clearModules } = useNavBarModulesStore(
		useShallow((state) => ({
			modules: state.modules,
			setModule: state.setModule,
			removeModule: state.removeModule,
			clearModules: state.clearModules,
		}))
	);
	useEffect(() => {
		if (favoriteButton) setModule("FavoriteModule", favoriteButton);
		if (contextMenuButton) setModule("ContextMenuModule", contextMenuButton);
		return () => {
			if (options?.resetOnUnmount) {
				clearModules();
			}
		};
	}, [favoriteButton, contextMenuButton]);
}
