import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
import { GaugesTable } from "./subComponents/GaugesTable";
import { MiscsTable } from "./subComponents/MiscsTable";
import {
	CharacterCoreMetrics,
	CharacterItemStackExpanded,
	CharacterMiscMetrics,
	RaceData,
} from "@/libs/stp@types";
import { LevelAndRaceDisplay } from "./subComponents/LevelAndRaceDisplay";
import { AttributesDisplay } from "./subComponents/AttributesDisplay";

interface CharacterHeaderProps {
	level: number;
	race: RaceData;
	characterItems: CharacterItemStackExpanded[];
	coreMetrics: CharacterCoreMetrics;
	miscMetrics: CharacterMiscMetrics;
}
export function CharacterHeader({
	level,
	race,
	characterItems,
	coreMetrics,
	miscMetrics,
}: CharacterHeaderProps) {
	return (
		<NotionBox
			backgroundColor="blue"
			withoutBorder>
			<NotionBox
				backgroundColor="orange"
				withoutPadding>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<LevelAndRaceDisplay
							level={level}
							race={race}
						/>
					}
					colum2={<AttributesDisplay miscMetrics={miscMetrics} />}
				/>
			</NotionBox>
			<Notion2Columns
				withoutPadding
				colum1={<GaugesTable coreMetrics={coreMetrics} />}
				colum2={
					<MiscsTable
						characterItems={characterItems}
						coreMetrics={coreMetrics}
						miscMetrics={miscMetrics}
					/>
				}
			/>
		</NotionBox>
	);
}
