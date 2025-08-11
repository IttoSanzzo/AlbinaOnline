import { LyurCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { UIBasics } from "@/components/(UIBasics)";

function tableParameterEntry(title: string, value: number) {
	return [
		<StyledFalseLink title={title} />,
		<UIBasics.Text
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
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding
			withoutBorder
			withoutMargin>
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"Lyur"}
			/>
			<div style={{ display: "flex" }}>
				<UIBasics.Table
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [tableParameterEntry("Total", lyurCoins.lyur)],
					}}
				/>
			</div>
		</UIBasics.Box>
	);
}
