"use client";

import { useEffect } from "react";

import { useVttInteractionContext } from "../Contexts/VttInteractionContextProvider";
import { VttInteractionType } from "../Types/VttMouseState";

const ATTRIBUTE_NAME = "data-cursor-hover-interaction-type";

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
			) as VttInteractionType | null;

			setHoverInteractionType(type);
		};

		document.addEventListener("mouseover", handleMouseOver);

		return () => {
			document.removeEventListener("mouseover", handleMouseOver);

			setHoverInteractionType(null);
		};
	}, [setHoverInteractionType]);
}
