import {
	NotionTable,
	NotionText,
	NotionTextColor,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterCoreMetrics, Guid } from "@/libs/stp@types";

function formTableEntry(
	title: string,
	value: number,
	color: keyof typeof NotionTextColor
) {
	return [
		<NotionText
			textColor="gray"
			children={title}
		/>,
		<NotionText
			display="block"
			textAlign="center"
			textColor={color}
			children={value.toString()}
		/>,
	];
}

interface CharacterGaugeDisplayProps {
	characterId: Guid;
	coreMetrics: CharacterCoreMetrics;
	gauge: "healthPoints" | "staminaPoints" | "manaPoints";
	name: string;
	acronym: string;
	color: keyof typeof NotionTextColor;
}
export function CharacterGaugeDisplay({
	characterId,
	coreMetrics,
	gauge,
	name,
	acronym,
	color,
}: CharacterGaugeDisplayProps) {
	const thisGauge = coreMetrics[gauge];
	return (
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title={name}
			memoryId={`${characterId}-${acronym}`}>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}>
				<NotionTable
					tableData={{
						tableLanes: [
							formTableEntry(`${acronym} Atual`, thisGauge.baseCurrent, color),
							formTableEntry(
								`${acronym} Temp.`,
								thisGauge.temporaryCurrentModifier,
								color
							),
							formTableEntry(`${acronym} Max`, thisGauge.baseMax, color),
							formTableEntry(
								`${acronym} Max Temp.`,
								thisGauge.temporaryMaxModifier,
								color
							),
						],
					}}
				/>
			</div>
		</NotionToggleHeader>
	);
}
