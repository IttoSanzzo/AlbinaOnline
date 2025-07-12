"use client";

import { setCssAttribute } from "@/utils/CssPropertyUtils";
import { useLayoutEffect } from "react";

export function DataInitComplete() {
	useLayoutEffect(() => {
		setTimeout(() => {
			setCssAttribute("data-init-complete", "true");
		}, 1500);
	}, []);
	return null;
}
