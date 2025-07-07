"use client";

import { ReactNode } from "react";
import { useSetNavBarModulesStore } from "../hooks/useNavBarModules";

interface SetNavBarModulesProps {
	favoriteButton: () => ReactNode;
	addNewButton?: () => ReactNode;
}
export function SetNavBarModules({
	favoriteButton,
	addNewButton,
}: SetNavBarModulesProps) {
	useSetNavBarModulesStore(favoriteButton, addNewButton);
	return null;
}
