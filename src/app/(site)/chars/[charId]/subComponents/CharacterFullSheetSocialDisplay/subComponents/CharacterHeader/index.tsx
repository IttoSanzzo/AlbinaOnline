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
import { UIBasics } from "@/components/(UIBasics)";

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
		<UIBasics.Box
			backgroundColor="blue"
			withoutBorder>
			<UIBasics.Box
				backgroundColor="orange"
				withoutPadding>
				<UIBasics.MultiColumn.Two
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
			</UIBasics.Box>
			<UIBasics.MultiColumn.Two
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
		</UIBasics.Box>
	);
}
