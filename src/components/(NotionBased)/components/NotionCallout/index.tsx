import {
	HeaderContainer,
	NotionCalloutContainer,
	TitleArrayContainer,
} from "./styledElements";
import { CSSProperties, ReactNode } from "react";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import {
	NotionText,
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "../../index";

interface NotionCalloutProps extends NotionPropsColor {
	children?: ReactNode;
	title?: ReactNode | string | string[];
	titleColor?: keyof typeof NotionTextColor;
	icon?: StpIconProps;
}

export function NotionCallout({
	title,
	titleColor,
	icon = { name: "Note" },
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

	const finalTitle =
		typeof title === "string" ? (
			<NotionText textColor={titleColor}>{title}</NotionText>
		) : Array.isArray(title) ? (
			<TitleArrayContainer>
				{title.map((title) => (
					<div key={title}>
						<NotionText textColor={titleColor}>{title}</NotionText>
					</div>
				))}
			</TitleArrayContainer>
		) : (
			title
		);

	return (
		<NotionCalloutContainer style={style}>
			<HeaderContainer>
				{StpIcon(icon)}
				{finalTitle}
			</HeaderContainer>
			<div>{children}</div>
		</NotionCalloutContainer>
	);
}
