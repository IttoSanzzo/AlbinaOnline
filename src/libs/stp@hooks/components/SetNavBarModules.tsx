"use client";

import { ReactNode } from "react";
import { useSetNavBarModules } from "../hooks";

interface SetNavBarModulesProps {
	favoriteButton?: () => ReactNode;
	contextMenuButton?: () => ReactNode;
}
export function SetNavBarModules({
	favoriteButton,
	contextMenuButton,
}: SetNavBarModulesProps) {
	useSetNavBarModules(favoriteButton, contextMenuButton, {
		resetOnUnmount: true,
	});
	return null;
}
