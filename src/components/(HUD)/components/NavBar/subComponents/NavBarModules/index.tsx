"use client";

import { useNavBarModules } from "@/libs/stp@hooks";
import { NavBarModulesContainer } from "./styledElements";
import React from "react";

export function NavBarModules() {
	const { modules } = useNavBarModules();

	return (
		<NavBarModulesContainer>
			{Object.entries(modules).map(([key, componentFactory]) =>
				["FavoriteModule", "ContextMenuModule"].includes(key) == false ? (
					<div key={key}>{React.createElement(componentFactory)}</div>
				) : null
			)}
			{modules.FavoriteModule && (
				<div key={"FavoriteModule"}>
					{React.createElement(modules.FavoriteModule)}
				</div>
			)}
			{modules.ContextMenuModule && (
				<div key={"ContextMenuModule"}>
					{React.createElement(modules.ContextMenuModule)}
				</div>
			)}
		</NavBarModulesContainer>
	);
}
