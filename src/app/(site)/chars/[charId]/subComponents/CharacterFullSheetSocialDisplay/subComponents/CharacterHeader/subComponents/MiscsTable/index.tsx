import { NotionTable, NotionText } from "@/components/(NotionBased)";
import {
	CharacterCoreMetrics,
	CharacterItemStackExpanded,
	CharacterMiscMetrics,
} from "@/libs/stp@types";

function calcTotalWeight(characterItems: CharacterItemStackExpanded[]) {
	return (
		characterItems.reduce(
			(acc, current) => acc + current.amount * current.item.properties.weight,
			0
		) / 1000
	);
}

interface MiscsTableProps {
	coreMetrics: CharacterCoreMetrics;
	miscMetrics: CharacterMiscMetrics;
	characterItems: CharacterItemStackExpanded[];
}
export function MiscsTable({
	characterItems,
	coreMetrics,
	miscMetrics,
}: MiscsTableProps) {
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
