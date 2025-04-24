import { NotionCallout, NotionToggle } from "@/components/(NotionBased)";
import { NotionQuoteList } from "@/components/(UTILS)";
import { GenericInfo } from "@/libs/stp@types";

interface GenericInfoCalloutProps {
	info: GenericInfo;
}

export function GenericInfoCallout({ info }: GenericInfoCalloutProps) {
	return (
		<>
			<NotionCallout
				icon={{
					name: "Info",
					color: "purple",
				}}
				titleColor="gray"
				title={"Info"}>
				<NotionToggle
					memoryId="InfoSummary"
					titleColor="blue"
					title={"🪄|Resumo|🪄"}>
					<NotionQuoteList
						withDivisor
						quotes={info.summary}
					/>
				</NotionToggle>
				<NotionToggle
					memoryId="InfoDescription"
					titleColor="blue"
					title={"🔎|Descrição Geral|🔎"}>
					<NotionQuoteList
						withDivisor
						quotes={info.description}
					/>
				</NotionToggle>
				<NotionToggle
					memoryId="InfoMiscs"
					titleColor="blue"
					title={"💮|Miscelâneas|💮"}>
					<NotionQuoteList
						withDivisor
						quotes={info.miscellaneous}
					/>
				</NotionToggle>
			</NotionCallout>
		</>
	);
}
