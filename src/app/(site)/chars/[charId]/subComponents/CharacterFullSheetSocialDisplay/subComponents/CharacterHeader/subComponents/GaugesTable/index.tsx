import { UIBasics } from "@/components/(UIBasics)";
import { CharacterCoreMetrics } from "@/libs/stp@types";

interface GaugesTableProps {
	coreMetrics: CharacterCoreMetrics;
}
export function GaugesTable({ coreMetrics }: GaugesTableProps) {
	return (
		<UIBasics.Table
			fixedLinePositions={[1, 3, 4, 5]}
			fixedLineWidths={[20, 5, 10, 5]}
			tableData={{
				tableLanes: [
					[
						<UIBasics.Text
							textColor="red"
							children="HP"
						/>,
						<UIBasics.Text
							textColor="red"
							display="block"
							textAlign="center"
							children={`${coreMetrics.healthPoints.baseCurrent} / ${coreMetrics.healthPoints.effectiveMax} + ${coreMetrics.healthPoints.temporaryCurrentModifier}`}
						/>,
					],
					[
						<UIBasics.Text
							textColor="green"
							children="EP"
						/>,
						<UIBasics.Text
							textColor="green"
							display="block"
							textAlign="center"
							children={`${coreMetrics.staminaPoints.baseCurrent} / ${coreMetrics.staminaPoints.effectiveMax} + ${coreMetrics.staminaPoints.temporaryCurrentModifier}`}
						/>,
					],
					[
						<UIBasics.Text
							textColor="blue"
							children="MP"
						/>,
						<UIBasics.Text
							textColor="blue"
							display="block"
							textAlign="center"
							children={`${coreMetrics.manaPoints.baseCurrent} / ${coreMetrics.manaPoints.effectiveMax} + ${coreMetrics.manaPoints.temporaryCurrentModifier}`}
						/>,
					],
				],
			}}
		/>
	);
}
