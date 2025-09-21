import { CSSProperties } from "react";

export enum StandartTextColor {
	"default" = "#DFDFDF",
	"red" = "#D44C47",
	"pink" = "#C14C8A",
	"blue" = "#337EA9",
	"purple" = "#9065B0",
	"green" = "#448361",
	"yellow" = "#CB912F",
	"orange" = "#D9730D",
	"brown" = "#9F6B53",
	"gray" = "#989898",
	"darkGray" = "#37352F",
}

export enum StandartBackgroundColor {
	"default" = "",
	"red" = "#352120",
	"pink" = "#32212A",
	"blue" = "#1D282E",
	"purple" = "#2B2530",
	"green" = "#202924",
	"yellow" = "#332B1D",
	"orange" = "#352718",
	"brown" = "#2D2622",
	"gray" = "#272624",
	"darkGray" = "#1E1E1D",
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
