import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { CharacterCoreMetrics, Guid } from "@/libs/stp@types";
import { CSSProperties } from "react";

function formTableEntry(
	title: string,
	value: number,
	color: keyof typeof StandartTextColor,
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<UIBasics.Text
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
	color: keyof typeof StandartTextColor;
	style?: CSSProperties;
}
export function CharacterGaugeDisplay({
	coreMetrics,
	gauge,
	name,
	acronym,
	color,
	style,
}: CharacterGaugeDisplayProps) {
	const thisGauge = coreMetrics[gauge];
	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin
			withoutBorder
			withoutBorderRadius
			style={{ padding: "5px", ...style }}>
			<UIBasics.Header
				children={name}
				textAlign="center"
				headerType="h2"
				textColor="yellow"
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}>
				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry(`${acronym} Atual`, thisGauge.baseCurrent, color),
							formTableEntry(
								`${acronym} Temp.`,
								thisGauge.temporaryCurrentModifier,
								color,
							),
							formTableEntry(`${acronym} Max`, thisGauge.baseMax, color),
							formTableEntry(
								`${acronym} Max Temp.`,
								thisGauge.temporaryMaxModifier,
								color,
							),
						],
					}}
				/>
			</div>
		</UIBasics.Box>
	);
}
