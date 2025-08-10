import { CSSProperties } from "react";
import { StandartBackgroundColor, StandartTextColor } from "../core";

export function StandartTextColorToProperty(
	textColor?: StandartTextColor
): CSSProperties["color"] {
	return textColor;
}
export function StandartTextColorKeyToProperty(
	textColorKey?: keyof typeof StandartTextColor
): CSSProperties["color"] {
	if (textColorKey) return StandartTextColor[textColorKey];
	return undefined;
}

export function StandartBackgroundColorToProperty(
	backgroundColor?: StandartBackgroundColor
): CSSProperties["backgroundColor"] {
	return backgroundColor;
}
export function StandartBackgroundColorKeyToProperty(
	backgroundColorKey?: keyof typeof StandartBackgroundColor
): CSSProperties["backgroundColor"] {
	if (backgroundColorKey) return StandartBackgroundColor[backgroundColorKey];
	return undefined;
}

export function StandartColorKeysToProperties(
	textColorKey?: keyof typeof StandartTextColor,
	backgroundColorKey?: keyof typeof StandartBackgroundColor
): CSSProperties {
	return {
		color: StandartTextColorKeyToProperty(textColorKey),
		backgroundColor: StandartBackgroundColorKeyToProperty(backgroundColorKey),
	};
}
