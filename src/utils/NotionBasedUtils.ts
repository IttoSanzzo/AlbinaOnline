export enum NotionTextColor {
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

export enum NotionBackgroundColor {
	"default" = "",
	"gray" = "#272624",
	"brown" = "#2D2622",
	"orange" = "#352718",
	"yellow" = "#332B1D",
	"green" = "#202924",
	"blue" = "#1D282E",
	"purple" = "#2B2530",
	"pink" = "#32212A",
	"red" = "#352120",
}
type NotionBackgroundColorKeys = keyof typeof NotionBackgroundColor;
type NotionTextColorKeys = keyof typeof NotionTextColor;

export interface NotionPropsColor {
	textColor?: NotionTextColorKeys;
	backgroundColor?: NotionBackgroundColorKeys;
}

export interface NotionPropsText {
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right";
}
