import { ReactNode } from "react";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartColorProps, StandartTextColor } from "../../core";
import { UIBasics } from "../..";

export const CalloutContainer = newStyledElement.div(styles.calloutContainer);
export const HeaderContainer = newStyledElement.div(styles.headerContainer);
export const TitleArrayContainer = newStyledElement.div(
	styles.titleArrayContainer
);
export const ContentContainer = newStyledElement.div(styles.contentContainer);

interface CalloutProps extends StandartColorProps {
	children?: ReactNode;
	title?: ReactNode | string | string[];
	titleColor?: keyof typeof StandartTextColor;
	icon?: StpIconProps;
}

export function Callout({
	title,
	titleColor,
	icon = { name: "Note" },
	children,
	textColor,
	backgroundColor,
}: CalloutProps) {
	if (title) {
		const finalTitle =
			typeof title === "string" ? (
				<UIBasics.Text textColor={titleColor}>{title}</UIBasics.Text>
			) : Array.isArray(title) ? (
				<TitleArrayContainer>
					{title.map((title) => (
						<div key={title}>
							<UIBasics.Text textColor={titleColor}>{title}</UIBasics.Text>
						</div>
					))}
				</TitleArrayContainer>
			) : (
				title
			);

		return (
			<UIBasics.Box backgroundColor={backgroundColor}>
				<ContentContainer
					style={
						textColor ? { color: StandartTextColor[textColor] } : undefined
					}>
					<HeaderContainer>
						{StpIcon(icon)}
						{finalTitle}
					</HeaderContainer>
					{children}
				</ContentContainer>
			</UIBasics.Box>
		);
	}
	return (
		<UIBasics.Box backgroundColor={backgroundColor}>
			<ContentContainer
				style={textColor ? { color: StandartTextColor[textColor] } : undefined}>
				{children}
			</ContentContainer>
		</UIBasics.Box>
	);
}
