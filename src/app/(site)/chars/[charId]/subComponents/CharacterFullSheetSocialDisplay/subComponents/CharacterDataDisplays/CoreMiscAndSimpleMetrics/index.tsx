import { UIBasics } from "@/components/(UIBasics)";
import {
	CharacterCoreMetrics,
	CharacterMiscMetrics,
	Guid,
} from "@/libs/stp@types";

function formTableEntry(title: string, value: number) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<UIBasics.Text
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
	coreMetrics,
	miscMetrics,
}: CoreMiscAndSimpleMetricsProps) {
	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin
			withoutBorder
			withoutBorderRadius
			style={{ borderTopRightRadius: "var(--rd-md)", padding: "5px" }}>
			<UIBasics.Header
				children="Miscs"
				textAlign="center"
				headerType="h2"
				textColor="yellow"
			/>
			<div style={{ display: "flex" }}>
				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry("Iniciativa", coreMetrics.initiative),
							formTableEntry("C.A.", coreMetrics.armorClass),
							formTableEntry("Mov. de Andar", coreMetrics.speedStats.walk),
							formTableEntry("Mov. de Combate", coreMetrics.speedStats.combat),
							formTableEntry("Mov. de Nado", coreMetrics.speedStats.swim ?? 0),
							formTableEntry("Mov. de Voo", coreMetrics.speedStats.fly ?? 0),
							formTableEntry(
								"Mov. de Escalada",
								coreMetrics.speedStats.climb ?? 0,
							),
							formTableEntry(
								"Mov. de Cavar",
								coreMetrics.speedStats.burrow ?? 0,
							),
							formTableEntry("Carga Máxima", miscMetrics.carryCapacity),
						],
					}}
				/>
			</div>
		</UIBasics.Box>
	);
}
