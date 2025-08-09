import {
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import {
	CharacterCoreMetrics,
	CharacterMiscMetrics,
	Guid,
} from "@/libs/stp@types";

function formTableEntry(title: string, value: number) {
	return [
		<NotionText
			textColor="gray"
			children={title}
		/>,
		<NotionText
			display="block"
			textAlign="center"
			textColor="gray"
			children={value.toString()}
		/>,
	];
}

interface CoreMiscAndSimpleMetricsProps {
	characterId: Guid;
	coreMetrics: CharacterCoreMetrics;
	miscMetrics: CharacterMiscMetrics;
}
export function CoreMiscAndSimpleMetrics({
	characterId,
	coreMetrics,
	miscMetrics,
}: CoreMiscAndSimpleMetricsProps) {
	return (
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Miscs"
			memoryId={`${characterId}-MiscMetrics`}>
			<div style={{ display: "flex" }}>
				<NotionTable
					tableData={{
						tableLanes: [
							formTableEntry("Carga Máxima", miscMetrics.carryCapacity),
							formTableEntry("Iniciativa", coreMetrics.initiative),
							formTableEntry("C.A.", coreMetrics.armorClass),
							formTableEntry("Mov. de Andar", coreMetrics.speedStats.walkSpeed),
							formTableEntry(
								"Mov. de Combate",
								coreMetrics.speedStats.combatSpeed
							),
							formTableEntry("Mov. de Nado", coreMetrics.speedStats.swimSpeed),
							formTableEntry("Mov. de Voo", coreMetrics.speedStats.flySpeed),
						],
					}}
				/>
			</div>
		</NotionToggleHeader>
	);
}
