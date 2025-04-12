export enum NotionTextColor {
	"Default" = "#DFDFDF",
	"Gray" = "#37352F",
	"Brown" = "#9F6B53",
	"Orange" = "#D9730D",
	"Yellow" = "#CB912F",
	"Green" = "#448361",
	"Blue" = "#337EA9",
	"Purple" = "#9065B0",
	"Pink" = "#C14C8A",
	"Red" = "#D44C47",
}

export enum NotionBackgroundColor {
	"Default" = "",
	"Gray" = `${NotionTextColor.Gray}75`,
	"Brown" = `${NotionTextColor.Brown}25`,
	"Orange" = `${NotionTextColor.Orange}25`,
	"Yellow" = `${NotionTextColor.Yellow}25`,
	"Green" = `${NotionTextColor.Green}25`,
	"Blue" = `${NotionTextColor.Blue}25`,
	"Purple" = `${NotionTextColor.Purple}25`,
	"Pink" = `${NotionTextColor.Pink}25`,
	"Red" = `${NotionTextColor.Red}25`,
}

export interface NotionPropsColor {
	textColor?: NotionTextColor;
	backgroundColor?: NotionBackgroundColor;
}

export interface NotionPropsText {
	withBold?: boolean;
	withItalic?: boolean;
	withUnderline?: boolean;
	textAlign?: "left" | "center" | "right";
}
