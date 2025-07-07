"use client";

import { useNavBarModules } from "@/libs/stp@hooks";
import { NavBarModulesContainer } from "./styledElements";
import React from "react";

export default function NavBarModules() {
	const { modules } = useNavBarModules();

	return (
		<NavBarModulesContainer>
			{Object.entries(modules).map(([key, componentFactory]) =>
				componentFactory ? (
					<div key={key}>{React.createElement(componentFactory)}</div>
				) : null
			)}
		</NavBarModulesContainer>
	);
}
