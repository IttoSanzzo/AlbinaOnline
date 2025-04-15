import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import { HeaderContainer, NotionCalloutContainer } from "./styledElements";
import { CSSProperties, ReactNode } from "react";
import { StpIcon, StpIconProps } from "../../../../libs/stp@icons";

interface NotionCalloutProps extends NotionPropsColor {
	children?: ReactNode;
	title?: ReactNode;
	icon?: StpIconProps;
}

export default function NotionCallout({
	title,
	icon = { name: "Article" },
	children,
	textColor,
	backgroundColor,
}: NotionCalloutProps) {
	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
			borderColor: `${NotionTextColor[backgroundColor]}15`,
		}),
	};

	return (
		<NotionCalloutContainer style={style}>
			<HeaderContainer>
				{StpIcon(icon)}
				{title}
			</HeaderContainer>
			<div>{children}</div>
		</NotionCalloutContainer>
	);
}
