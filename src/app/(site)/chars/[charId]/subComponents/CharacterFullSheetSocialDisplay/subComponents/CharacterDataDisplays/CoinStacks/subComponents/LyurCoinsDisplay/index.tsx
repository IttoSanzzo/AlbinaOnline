import {
	NotionBox,
	NotionHeader,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { LyurCoins } from "@/libs/stp@types";
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

interface LyurCoinsDisplayProps {
	lyurCoins: LyurCoins;
}
export function LyurCoinsDisplay({ lyurCoins }: LyurCoinsDisplayProps) {
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
				children={"Lyur"}
			/>
			<div style={{ display: "flex" }}>
				<NotionTable
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [tableParameterEntry("Total", lyurCoins.lyur)],
					}}
				/>
			</div>
		</NotionBox>
	);
}
