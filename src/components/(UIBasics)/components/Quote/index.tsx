import { ReactNode } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartColorProps, StandartTextColor } from "../../core";
import { StandartColorKeysToProperties } from "../../utils";
import { UIBasics } from "../..";

export const QuoteContainer = newStyledElement.div(styles.quoteContainer);
export const BeforeBar = newStyledElement.span(styles.beforeBar);
export const ContentContainer = newStyledElement.div(styles.contentContainer);

interface QuoteProps extends StandartColorProps {
	children?: ReactNode | string;
}
export function Quote({ children, textColor, backgroundColor }: QuoteProps) {
	const style = StandartColorKeysToProperties(textColor, backgroundColor);

	return (
		<QuoteContainer style={style}>
			<BeforeBar
				style={{
					backgroundColor: textColor
						? StandartTextColor[textColor]
						: StandartTextColor.default,
				}}
			/>
			<ContentContainer>
				{typeof children === "string" ? (
					<UIBasics.Text>{children}</UIBasics.Text>
				) : (
					children
				)}
			</ContentContainer>
		</QuoteContainer>
	);
}
