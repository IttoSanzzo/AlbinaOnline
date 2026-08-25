import { CSSProperties } from "react";

export enum StandartTextColor {
	"default" = "#DFDFDF",

	"red" = "#D44C47",
	"darkRed" = "#A83F3B",
	"lightRed" = "#E56B65",

	"pink" = "#C14C8A",
	"darkPink" = "#963B6C",
	"lightPink" = "#D76BA1",

	"purple" = "#9065B0",
	"darkPurple" = "#704E8A",
	"lightPurple" = "#AB82C5",

	"blue" = "#337EA9",
	"darkBlue" = "#286582",
	"lightBlue" = "#5799BD",

	"cyan" = "#3A8C9A",
	"darkCyan" = "#2D6E79",
	"lightCyan" = "#5CAEB9",

	"teal" = "#3B8C82",
	"darkTeal" = "#2E6F68",
	"lightTeal" = "#5AAFA5",

	"green" = "#448361",
	"darkGreen" = "#35694E",
	"lightGreen" = "#63A37D",

	"lime" = "#719447",
	"darkLime" = "#597536",
	"lightLime" = "#8CAF5D",

	"yellow" = "#CB912F",
	"darkYellow" = "#A87528",
	"lightYellow" = "#DDA84C",

	"orange" = "#D9730D",
	"darkOrange" = "#B45D0B",
	"lightOrange" = "#E58B2C",

	"brown" = "#9F6B53",
	"darkBrown" = "#7D5341",
	"lightBrown" = "#B9856A",

	"gray" = "#989898",
	"darkGray" = "#37352F",
	"darkerGray" = "#242320",
	"lightGray" = "#B8B8B8",

	"white" = "#FFFFFF",
	"black" = "#000000",
}

export enum StandartBackgroundColor {
	"default" = "",

	"red" = "#352120",
	"darkRed" = "#2B1B1A",
	"lightRed" = "#402523",

	"pink" = "#32212A",
	"darkPink" = "#291B22",
	"lightPink" = "#3B242F",

	"purple" = "#2B2530",
	"darkPurple" = "#241F28",
	"lightPurple" = "#332A38",

	"blue" = "#1D282E",
	"darkBlue" = "#192328",
	"lightBlue" = "#223139",

	"cyan" = "#1D292C",
	"darkCyan" = "#192426",
	"lightCyan" = "#233337",

	"teal" = "#1D2927",
	"darkTeal" = "#192321",
	"lightTeal" = "#233431",

	"green" = "#202924",
	"darkGreen" = "#1B241F",
	"lightGreen" = "#253029",

	"lime" = "#252B1D",
	"darkLime" = "#202519",
	"lightLime" = "#2B321F",

	"yellow" = "#332B1D",
	"darkYellow" = "#2A2419",
	"lightYellow" = "#3B301D",

	"orange" = "#352718",
	"darkOrange" = "#2B2117",
	"lightOrange" = "#3D2C1A",

	"brown" = "#2D2622",
	"darkBrown" = "#27201D",
	"lightBrown" = "#352B26",

	"gray" = "#272624",
	"darkGray" = "#1E1E1D",
	"darkerGray" = "#151514",
	"lightGray" = "#302F2D",

	"white" = "#FFFFFF",
	"black" = "#000000",
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
