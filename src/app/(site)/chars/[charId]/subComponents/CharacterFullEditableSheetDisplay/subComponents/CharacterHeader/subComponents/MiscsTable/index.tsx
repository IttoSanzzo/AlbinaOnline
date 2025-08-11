import { useContext } from "react";
import { CoreMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { MiscMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { ItemsContext } from "../../../CharacterEditableSheetContextProviders/contexts/Items";
import { CharacterItemStackExpanded } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";

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
		<UIBasics.Table
			fixedLinePositions={[1, 3]}
			fixedLineWidths={[28, 20]}
			withHeaderColumn={false}
			columnBackgroundColors={["darkGray", undefined, "darkGray"]}
			tableData={{
				tableLanes: [
					[
						<UIBasics.Text
							textColor="gray"
							children={"Iniciativa"}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.initiative)}
						/>,
						<UIBasics.Text
							textColor="gray"
							children={"Carga"}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={`${calcTotalWeight(characterItems)}/${
								miscMetrics.carryCapacity
							}Kgs`}
						/>,
					],
					[
						<UIBasics.Text
							textColor="gray"
							children={"C.A."}
						/>,
						<UIBasics.Text
							textColor="gray"
							display="block"
							textAlign="center"
							children={String(coreMetrics.armorClass)}
						/>,
					],
					[
						<UIBasics.Text
							textColor="gray"
							children={"Movimento"}
						/>,
						<UIBasics.Text
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
