"use client";

import { useEffect } from "react";

import { useVttInteractionContext } from "../Contexts/VttInteractionContextProvider";
import { VttCursorInteractionType } from "../Types/VttMouseState";
import { VttElementDataAttribute } from "./ElementDataAttributeUtils";

const ATTRIBUTE_NAME = VttElementDataAttribute.CursorHoverInteractionType;

export function useCursorHoverInteraction() {
	const { setHoverInteractionType } = useVttInteractionContext();

	useEffect(() => {
		const handleMouseOver = (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Element)) {
				setHoverInteractionType(null);
				return;
			}
			const element = target.closest(`[${ATTRIBUTE_NAME}]`);
			if (!element) {
				setHoverInteractionType(null);
				return;
			}
			const type = element.getAttribute(
				ATTRIBUTE_NAME,
			) as VttCursorInteractionType | null;
			setHoverInteractionType(type);
		};
		document.addEventListener("mouseover", handleMouseOver);
		return () => {
			document.removeEventListener("mouseover", handleMouseOver);
			setHoverInteractionType(null);
		};
	}, [setHoverInteractionType]);
}
