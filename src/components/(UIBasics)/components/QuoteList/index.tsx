import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "../../core";
import { UIBasics } from "../..";

const QuoteListContainer = newStyledElement.div(styles.quoteListContainer);

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
	const Divisor = withDivisor ? <UIBasics.Divisor /> : null;

	return (
		<QuoteListContainer>
			{Divisor}
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
			{Divisor}
		</QuoteListContainer>
	);
}
