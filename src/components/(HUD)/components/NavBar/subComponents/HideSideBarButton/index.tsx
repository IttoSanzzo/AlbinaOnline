"use client";

import { List } from "@phosphor-icons/react/List";
import { HideSideBarButtonContainer } from "./styledElements";
import { useLayoutEffect } from "react";
import { setCssAttribute } from "@/utils/CssPropertyUtils";

export default function HideSideBarButton() {
	function handleHideSideButton() {
		const current =
			document.documentElement.getAttribute("data-active-sidebar") === "true";
		setCssAttribute("data-active-sidebar", `${!current}`);
	}
	useLayoutEffect(() => {
		setCssAttribute("data-active-sidebar", "false");
	}, []);

	return (
		<HideSideBarButtonContainer onClick={handleHideSideButton}>
			<List
				color="#FFF"
				size={18}
			/>
		</HideSideBarButtonContainer>
	);
}
