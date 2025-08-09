import {
	NotionBox,
	NotionHeader,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { KorynCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";

function tableParameterEntry(title: string, value: number) {
	return [
		<StyledFalseLink title={title} />,
		<NotionText
			display="block"
			textAlign="center"
			textColor="orange"
			children={value.toString()}
		/>,
	];
}

interface KorynCoinsDisplayProps {
	korynCoins: KorynCoins;
}
export function KorynCoinsDisplay({ korynCoins }: KorynCoinsDisplayProps) {
	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding
			withoutBorder
			withoutMargin>
			<NotionHeader
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"Koryn"}
			/>
			<div style={{ display: "flex" }}>
				<NotionTable
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [
							tableParameterEntry("Cobre P.", korynCoins.copperSmall),
							tableParameterEntry("Cobre G.", korynCoins.copperLarge),
							tableParameterEntry("Prata P.", korynCoins.silverSmall),
							tableParameterEntry("Prata G.", korynCoins.silverLarge),
							tableParameterEntry("Ouro P.", korynCoins.goldSmall),
							tableParameterEntry("Ouro G.", korynCoins.goldLarge),
							tableParameterEntry("Platina", korynCoins.platinum),
							tableParameterEntry("Irídio", korynCoins.iridium),
							tableParameterEntry("Obsidiana", korynCoins.obsidian),
							tableParameterEntry("Esmeralda", korynCoins.emerald),
							tableParameterEntry("Diamante", korynCoins.diamond),
						],
					}}
				/>
			</div>
		</NotionBox>
	);
}
