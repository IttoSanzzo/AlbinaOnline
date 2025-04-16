import { NotionDivisor, NotionQuote } from "@/components/(NotionBased)";
import { NotionQuoteListContainer } from "./styledElements";

interface NotionQuoteListProps {
	quotes?: string[];
	withDivisor?: boolean;
}

export function NotionQuoteList({
	quotes,
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
						key={index}
						children={quote}
					/>
				))
			)}
			{divisor}
		</NotionQuoteListContainer>
	);
}
