import {
	ContentContainer,
	HeaderContainer,
	TitleArrayContainer,
} from "./styledElements";
import { ReactNode } from "react";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import {
	NotionText,
	NotionPropsColor,
	NotionTextColor,
	NotionBox,
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
	if (title) {
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
			<NotionBox backgroundColor={backgroundColor}>
				<ContentContainer
					style={textColor ? { color: NotionTextColor[textColor] } : undefined}>
					<HeaderContainer>
						{StpIcon(icon)}
						{finalTitle}
					</HeaderContainer>
					{children}
				</ContentContainer>
			</NotionBox>
		);
	}
	return (
		<NotionBox backgroundColor={backgroundColor}>
			<ContentContainer
				style={textColor ? { color: NotionTextColor[textColor] } : undefined}>
				{children}
			</ContentContainer>
		</NotionBox>
	);
}
