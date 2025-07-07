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
	addNewButton?: () => ReactNode,
	options?: { resetOnUnmount?: boolean }
) {
	const { modules, setModule, clearModules } = useNavBarModules();
	useEffect(() => {
		if (favoriteButton && modules["FavoriteModule"] !== favoriteButton)
			setModule("FavoriteModule", favoriteButton);
		if (addNewButton && modules["AddNewModule"] !== addNewButton)
			setModule("AddNewModule", addNewButton);
		return () => {
			if (options?.resetOnUnmount) {
				clearModules();
			}
		};
	}, [favoriteButton, addNewButton]);
}
