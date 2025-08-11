import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "../../core";
import { UIBasics } from "../..";

export const QuoteListContainer = newStyledElement.div(
	styles.quoteListContainer
);

interface QuoteListProps {
	quotes?: string[];
	textColor?: keyof typeof StandartTextColor;
	withDivisor?: boolean;
}

export function QuoteList({
	quotes,
	textColor,
	withDivisor = false,
}: QuoteListProps) {
	const divisor = withDivisor ? <UIBasics.Divisor /> : <></>;

	return (
		<QuoteListContainer>
			{divisor}
			{!quotes || quotes.length === 0 ? (
				<UIBasics.Quote />
			) : (
				quotes.map((quote, index) => (
					<UIBasics.Quote
						textColor={textColor}
						key={index}
						children={quote}
					/>
				))
			)}
			{divisor}
		</QuoteListContainer>
	);
}
