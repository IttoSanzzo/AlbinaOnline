import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { CharacterCoreMetrics } from "@/libs/stp@types";

interface GaugesTableProps {
	coreMetrics: CharacterCoreMetrics;
}
export function GaugesTable({ coreMetrics }: GaugesTableProps) {
	return (
		<div>
			<NotionTable
				fixedLinePositions={[1, 3, 4, 5]}
				fixedLineWidths={[20, 5, 10, 5]}
				tableData={{
					tableLanes: [
						[
							<NotionText
								textColor="red"
								children="HP"
							/>,
							<NotionText
								textColor="red"
								display="block"
								textAlign="center"
								children={`${coreMetrics.healthPoints.baseCurrent} / ${coreMetrics.healthPoints.effectiveMax} + ${coreMetrics.healthPoints.temporaryCurrentModifier}`}
							/>,
						],
						[
							<NotionText
								textColor="green"
								children="EP"
							/>,
							<NotionText
								textColor="green"
								display="block"
								textAlign="center"
								children={`${coreMetrics.staminaPoints.baseCurrent} / ${coreMetrics.staminaPoints.effectiveMax} + ${coreMetrics.staminaPoints.temporaryCurrentModifier}`}
							/>,
						],
						[
							<NotionText
								textColor="blue"
								children="MP"
							/>,
							<NotionText
								textColor="blue"
								display="block"
								textAlign="center"
								children={`${coreMetrics.manaPoints.baseCurrent} / ${coreMetrics.manaPoints.effectiveMax} + ${coreMetrics.manaPoints.temporaryCurrentModifier}`}
							/>,
						],
					],
				}}
			/>
		</div>
	);
}
