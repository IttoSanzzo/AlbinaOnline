import { UIBasics } from "@/components/(UIBasics)";
import { GenericInfo } from "@/libs/stp@types";

interface GenericInfoCalloutProps {
	info: GenericInfo;
}

export function GenericInfoCallout({ info }: GenericInfoCalloutProps) {
	return (
		<>
			<UIBasics.Callout
				icon={{
					name: "Info",
					color: "purple",
				}}
				titleColor="gray"
				title={"Info"}>
				<UIBasics.Toggle
					memoryId="InfoSummary"
					titleColor="blue"
					title={"🪄|Resumo|🪄"}>
					<UIBasics.List.Quote
						withDivisor
						quotes={info.summary}
					/>
				</UIBasics.Toggle>
				<UIBasics.Toggle
					memoryId="InfoDescription"
					titleColor="blue"
					title={"🔎|Descrição Geral|🔎"}>
					<UIBasics.List.Quote
						withDivisor
						quotes={info.description}
					/>
				</UIBasics.Toggle>
				<UIBasics.Toggle
					memoryId="InfoMiscs"
					titleColor="blue"
					title={"💮|Miscelâneas|💮"}>
					<UIBasics.List.Quote
						withDivisor
						quotes={info.miscellaneous}
					/>
				</UIBasics.Toggle>
			</UIBasics.Callout>
		</>
	);
}
