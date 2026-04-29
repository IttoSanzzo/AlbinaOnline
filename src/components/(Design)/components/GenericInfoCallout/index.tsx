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
					titleColor={info.summary.length > 0 ? "blue" : "darkGray"}
					title={"🪄|Resumo|🪄"}>
					<UIBasics.List.Quote
						withDivisor
						quotes={info.summary}
					/>
				</UIBasics.Toggle>
				<UIBasics.Toggle
					memoryId="InfoDescription"
					titleColor={info.description.length > 0 ? "blue" : "darkGray"}
					title={"🔎|Descrição Geral|🔎"}>
					<UIBasics.List.Quote
						withDivisor
						quotes={info.description}
					/>
				</UIBasics.Toggle>
				<UIBasics.Toggle
					memoryId="InfoMiscs"
					titleColor={info.miscellaneous.length > 0 ? "blue" : "darkGray"}
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
