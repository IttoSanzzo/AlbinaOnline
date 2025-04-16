import { GenericInfo } from "@/app/(site)/maestrias/[mastery]/(routeInfra)/pageData";
import { NotionCallout, NotionToggle } from "@/components/(NotionBased)";
import { NotionQuoteList } from "@/components/(UTILS)";

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
					titleColor="blue"
					title={"🪄|Resumo|🪄"}>
					<NotionQuoteList
						withDivisor
						quotes={info.summary}
					/>
				</NotionToggle>
				<NotionToggle
					titleColor="blue"
					title={"🔎|Descrição Geral|🔎"}>
					<NotionQuoteList
						withDivisor
						quotes={info.description}
					/>
				</NotionToggle>
				<NotionToggle
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
