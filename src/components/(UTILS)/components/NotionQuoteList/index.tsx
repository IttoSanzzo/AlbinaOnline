import {
	NotionDivisor,
	NotionQuote,
	NotionTextColor,
} from "@/components/(NotionBased)";
import { NotionQuoteListContainer } from "./styledElements";

interface NotionQuoteListProps {
	quotes?: string[];
	textColor?: keyof typeof NotionTextColor;
	withDivisor?: boolean;
}

export function NotionQuoteList({
	quotes,
	textColor,
	withDivisor = false,
}: NotionQuoteListProps) {
	const divisor = withDivisor ? <NotionDivisor /> : <></>;

	return (
		<NotionQuoteListContainer>
			{divisor}
			{!quotes || quotes.length === 0 ? (
				<NotionQuote />
			) : (
				quotes.map((quote, index) => (
					<NotionQuote
						textColor={textColor}
						key={index}
						children={quote}
					/>
				))
			)}
			{divisor}
		</NotionQuoteListContainer>
	);
}
