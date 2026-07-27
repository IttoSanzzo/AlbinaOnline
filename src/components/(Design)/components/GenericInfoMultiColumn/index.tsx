import { UIBasics } from "@/components/(UIBasics)";
import { GenericInfo } from "@/libs/stp@types";

interface GenericInfoMultiColumnProps {
	info: GenericInfo;
}
export function GenericInfoMultiColumn({ info }: GenericInfoMultiColumnProps) {
	return (
		<UIBasics.MultiColumn.Three
			colum1={
				<UIBasics.Box
					withoutBorder
					withoutMargin
					backgroundColor="gray">
					<UIBasics.Header
						textColor="purple"
						headerType="h3"
						backgroundColor="gray"
						textAlign="center"
						children={"¤ Resumo ¤"}
					/>
					<UIBasics.List.Quote
						whiteSpace="pre-wrap"
						withDivisor
						quotes={info.summary}
						textColor={info.summary.length == 0 ? "darkGray" : undefined}
					/>
				</UIBasics.Box>
			}
			colum2={
				<UIBasics.Box
					withoutBorder
					withoutMargin
					backgroundColor="gray">
					<UIBasics.Header
						textColor="purple"
						headerType="h3"
						backgroundColor="gray"
						textAlign="center"
						children={"¤ Descrição ¤"}
					/>
					<UIBasics.List.Quote
						whiteSpace="pre-wrap"
						withDivisor
						quotes={info.description}
						textColor={info.description.length == 0 ? "darkGray" : undefined}
					/>
				</UIBasics.Box>
			}
			colum3={
				<UIBasics.Box
					withoutBorder
					withoutMargin
					backgroundColor="gray">
					<UIBasics.Header
						textColor="purple"
						headerType="h3"
						backgroundColor="gray"
						textAlign="center"
						children={"¤ Miscelâneos ¤"}
					/>
					<UIBasics.List.Quote
						whiteSpace="pre-wrap"
						withDivisor
						quotes={info.miscellaneous}
						textColor={info.miscellaneous.length == 0 ? "darkGray" : undefined}
					/>
				</UIBasics.Box>
			}
		/>
	);
}
