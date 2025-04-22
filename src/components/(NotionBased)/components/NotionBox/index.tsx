import { CSSProperties, ReactNode } from "react";
import { NotionBoxContainer } from "./styledElements";
import {
	NotionBackgroundColor,
	NotionTextColor,
} from "../../core/NotionBasedCore";

interface NotionBoxProps {
	children?: ReactNode;
	withoutPadding?: boolean;
	withoutBorder?: boolean;
	backgroundColor?: keyof typeof NotionBackgroundColor;
}

export function NotionBox({
	children,
	withoutPadding = false,
	withoutBorder = false,
	backgroundColor,
}: NotionBoxProps) {
	const style: CSSProperties = {
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
			borderColor: `${NotionTextColor[backgroundColor]}15`,
		}),
		...(withoutBorder && {
			border: "0",
		}),
		...(withoutPadding && { padding: "0" }),
	};

	return <NotionBoxContainer style={style}>{children}</NotionBoxContainer>;
}
