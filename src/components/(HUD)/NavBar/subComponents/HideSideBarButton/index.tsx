"use client";

import { List } from "@phosphor-icons/react/List";
import { HideSideBarButtonContainer } from "./styledElements";
import { useEffect } from "react";
import { setCssAttribute } from "@/utils/CssPropertyUtils";

function handleHideSideButton() {
	const isSideBarHidden = localStorage.getItem("isSideBarHidden");
	const nextValue = isSideBarHidden === "true" ? "false" : "true";
	localStorage.setItem("isSideBarHidden", nextValue);
	setCssAttribute("data-hidden-sidebar", nextValue);
}

export default function HideSideBarButton() {
	useEffect(() => {
		var isSideBarHidden = localStorage.getItem("isSideBarHidden");
		if (!isSideBarHidden) {
			localStorage.setItem("isSideBarHidden", "false");
			isSideBarHidden = "false";
		}
		setCssAttribute("data-hidden-sidebar", isSideBarHidden!);
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
