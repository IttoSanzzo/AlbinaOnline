import { CSSProperties } from "react";

export enum StandartTextColor {
	"default" = "#DFDFDF",
	"gray" = "#989898",
	"darkGray" = "#37352F",
	"brown" = "#9F6B53",
	"orange" = "#D9730D",
	"yellow" = "#CB912F",
	"green" = "#448361",
	"blue" = "#337EA9",
	"purple" = "#9065B0",
	"pink" = "#C14C8A",
	"red" = "#D44C47",
}

export enum StandartBackgroundColor {
	"default" = "",
	"gray" = "#272624",
	"darkGray" = "#1E1E1D",
	"brown" = "#2D2622",
	"orange" = "#352718",
	"yellow" = "#332B1D",
	"green" = "#202924",
	"blue" = "#1D282E",
	"purple" = "#2B2530",
	"pink" = "#32212A",
	"red" = "#352120",
}

export interface StandartColorProps {
	textColor?: keyof typeof StandartTextColor;
	backgroundColor?: keyof typeof StandartBackgroundColor;
}

export interface StandartTextProps {
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: CSSProperties["textAlign"];
}
