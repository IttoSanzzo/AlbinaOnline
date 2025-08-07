import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { useContext } from "react";
import { CoreMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { MiscMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { ItemsContext } from "../../../CharacterEditableSheetContextProviders/contexts/Items";
import { CharacterItemStackExpanded } from "@/libs/stp@types";

function calcTotalWeight(characterItems: CharacterItemStackExpanded[]) {
	return (
		characterItems.reduce(
			(acc, current) => acc + current.amount * current.item.properties.weight,
			0
		) / 1000
	);
}

interface MiscsTableProps {}
export function MiscsTable({}: MiscsTableProps) {
	const { coreMetrics } = useContext(CoreMetricsContext);
	const { miscMetrics } = useContext(MiscMetricsContext);
	const { characterItems } = useContext(ItemsContext);

	return (
		<NotionTable
			fixedLinePositions={[1, 3]}
			fixedLineWidths={[28, 20]}
			withHeaderColumn={false}
			columnBackgroundColors={["darkGray", undefined, "darkGray"]}
			tableData={{
				tableLanes: [
					[
						<NotionText
							textColor="gray"
							children={"Iniciativa"}
						/>,
						<NotionText
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.initiative)}
						/>,
						<NotionText
							textColor="gray"
							children={"Carga"}
						/>,
						<NotionText
							textColor="gray"
							display="block"
							textAlign="center"
							children={`${calcTotalWeight(characterItems)}/${
								miscMetrics.carryCapacity
							}Kgs`}
						/>,
					],
					[
						<NotionText
							textColor="gray"
							children={"C.A."}
						/>,
						<NotionText
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.armorClass)}
						/>,
					],
					[
						<NotionText
							textColor="gray"
							children={"Movimento"}
						/>,
						<NotionText
							textColor="gray"
							display="block"
							textAlign="center"
							children={`${coreMetrics.speedStats.walkSpeed}/${coreMetrics.speedStats.combatSpeed}/${coreMetrics.speedStats.swimSpeed}/${coreMetrics.speedStats.flySpeed}`}
						/>,
					],
				],
			}}
		/>
	);
}
