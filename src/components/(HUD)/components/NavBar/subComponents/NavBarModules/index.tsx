"use client";

import { useNavBarModules } from "@/libs/stp@hooks";
import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const NavBarModulesContainer = newStyledElement.div(
	styles.navBarModulesContainer
);

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
