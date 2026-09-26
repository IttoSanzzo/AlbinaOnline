import { VttCursorInteractionType } from "../Types/VttMouseState";

export const VttElementDataAttribute = {
	EventMiddleButtonPan: "data-vtt-event-middle-button-pan",
	EventZoom: "data-vtt-event-zoom",
	EventPing: "data-vtt-event-ping",
	CursorHoverInteractionType: "data-cursor-hover-interaction-type",
} as const;

export type VttElementDataAttribute =
	(typeof VttElementDataAttribute)[keyof typeof VttElementDataAttribute];

export function setVttElementDataAttributes(
	...attributes: VttElementDataAttribute[]
): Record<string, true> {
	return Object.fromEntries(attributes.map((attribute) => [attribute, true]));
}

export function setVttElementDataAttributeObject(
	key: VttElementDataAttribute,
	value?: string,
): Record<string, string | undefined> {
	return { [key]: value };
}

export function setVttElementHoverInteraction(
	value?: VttCursorInteractionType,
): Record<string, string | undefined> {
	return { [VttElementDataAttribute.CursorHoverInteractionType]: value };
}

export function hasClosestAttribute(
	element: Element | EventTarget | null,
	attribute: string,
): boolean {
	return (
		element instanceof Element && element.closest(`[${attribute}]`) != null
	);
}
export function hasAttribute(
	element: Element | EventTarget | null,
	attribute: string,
): boolean {
	return element instanceof Element && element.hasAttribute(attribute);
}
