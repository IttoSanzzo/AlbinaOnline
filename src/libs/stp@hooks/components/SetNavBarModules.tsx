"use client";

import { ReactNode } from "react";
import { useSetNavBarModulesStore } from "../hooks/useNavBarModules";

interface SetNavBarModulesProps {
	favoriteButton?: () => ReactNode;
	contextMenuButton?: () => ReactNode;
}
export function SetNavBarModules({
	favoriteButton,
	contextMenuButton,
}: SetNavBarModulesProps) {
	useSetNavBarModulesStore(favoriteButton, contextMenuButton, {
		resetOnUnmount: true,
	});
	return null;
}
