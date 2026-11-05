import { CSSProperties } from "react";

export enum StandartTextColor {
	"default" = "#DFDFDF",

	"red" = "#D44C47",
	"darkRed" = "#A83F3B",
	"lightRed" = "#E56B65",
	"darkerRed" = "#AA3D39",
	"evenDarkerRed" = "#7F2E2B",

	"pink" = "#C14C8A",
	"darkPink" = "#963B6C",
	"lightPink" = "#D76BA1",
	"darkerPink" = "#9A3D6E",
	"evenDarkerPink" = "#742E53",

	"purple" = "#9065B0",
	"darkPurple" = "#704E8A",
	"lightPurple" = "#AB82C5",
	"darkerPurple" = "#73518D",
	"evenDarkerPurple" = "#563D6A",

	"blue" = "#337EA9",
	"darkBlue" = "#286582",
	"lightBlue" = "#5799BD",
	"darkerBlue" = "#296587",
	"evenDarkerBlue" = "#1F4C65",

	"cyan" = "#3A8C9A",
	"darkCyan" = "#2D6E79",
	"lightCyan" = "#5CAEB9",
	"darkerCyan" = "#2E707B",
	"evenDarkerCyan" = "#23545C",

	"teal" = "#3B8C82",
	"darkTeal" = "#2E6F68",
	"lightTeal" = "#5AAFA5",
	"darkerTeal" = "#2F7068",
	"evenDarkerTeal" = "#23544E",

	"green" = "#448361",
	"darkGreen" = "#35694E",
	"lightGreen" = "#63A37D",
	"darkerGreen" = "#36694E",
	"evenDarkerGreen" = "#294F3A",

	"lime" = "#719447",
	"darkLime" = "#597536",
	"lightLime" = "#8CAF5D",
	"darkerLime" = "#5A7639",
	"evenDarkerLime" = "#44592B",

	"yellow" = "#CB912F",
	"darkYellow" = "#A87528",
	"lightYellow" = "#DDA84C",
	"darkerYellow" = "#A27426",
	"evenDarkerYellow" = "#7A571C",

	"orange" = "#D9730D",
	"darkOrange" = "#B45D0B",
	"lightOrange" = "#E58B2C",
	"darkerOrange" = "#AE5C0A",
	"evenDarkerOrange" = "#824508",

	"brown" = "#9F6B53",
	"darkBrown" = "#7D5341",
	"lightBrown" = "#B9856A",
	"darkerBrown" = "#7F5642",
	"evenDarkerBrown" = "#5F4032",

	"gray" = "#989898",
	"darkGray" = "#37352F",
	"darkerGray" = "#242320",
	"lightGray" = "#B8B8B8",
	"evenDarkerGray" = "#5B5B5B",

	"white" = "#FFFFFF",
	"black" = "#000000",
}

export enum StandartBackgroundColor {
	"default" = "",

	"red" = "#352120",
	"darkRed" = "#2B1B1A",
	"lightRed" = "#402523",
	"darkerRed" = "#2A1A1A",
	"evenDarkerRed" = "#201413",

	"pink" = "#32212A",
	"darkPink" = "#291B22",
	"lightPink" = "#3B242F",
	"darkerPink" = "#281A22",
	"evenDarkerPink" = "#1E1419",

	"purple" = "#2B2530",
	"darkPurple" = "#241F28",
	"lightPurple" = "#332A38",
	"darkerPurple" = "#221E26",
	"evenDarkerPurple" = "#1A161D",

	"blue" = "#1D282E",
	"darkBlue" = "#192328",
	"lightBlue" = "#223139",
	"darkerBlue" = "#172025",
	"evenDarkerBlue" = "#11181C",

	"cyan" = "#1D292C",
	"darkCyan" = "#192426",
	"lightCyan" = "#233337",
	"darkerCyan" = "#172123",
	"evenDarkerCyan" = "#11191A",

	"teal" = "#1D2927",
	"darkTeal" = "#192321",
	"lightTeal" = "#233431",
	"darkerTeal" = "#17211F",
	"evenDarkerTeal" = "#111917",

	"green" = "#202924",
	"darkGreen" = "#1B241F",
	"lightGreen" = "#253029",
	"darkerGreen" = "#1A211D",
	"evenDarkerGreen" = "#131916",

	"lime" = "#252B1D",
	"darkLime" = "#202519",
	"lightLime" = "#2B321F",
	"darkerLime" = "#1E2217",
	"evenDarkerLime" = "#161A11",

	"yellow" = "#332B1D",
	"darkYellow" = "#2A2419",
	"lightYellow" = "#3B301D",
	"darkerYellow" = "#292217",
	"evenDarkerYellow" = "#1F1A11",

	"orange" = "#352718",
	"darkOrange" = "#2B2117",
	"lightOrange" = "#3D2C1A",
	"darkerOrange" = "#2A1F13",
	"evenDarkerOrange" = "#20170E",

	"brown" = "#2D2622",
	"darkBrown" = "#27201D",
	"lightBrown" = "#352B26",
	"darkerBrown" = "#241E1B",
	"evenDarkerBrown" = "#1B1714",

	"gray" = "#272624",
	"darkGray" = "#1E1E1D",
	"darkerGray" = "#151514",
	"lightGray" = "#302F2D",
	"evenDarkerGray" = "#171716",

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
