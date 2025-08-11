import { GaugesTable } from "./subComponents/GaugesTable";
import { MiscsTable } from "./subComponents/MiscsTable";
import { AttributesEditableDisplay } from "./subComponents/AttributesEditableDisplay";
import { LevelAndRaceEditableDisplay } from "./subComponents/LevelAndRaceEditableDisplay";
import { RaceData } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";

interface CharacterHeaderProps {
	level: number;
	race: RaceData;
}
export function CharacterHeader({ level, race }: CharacterHeaderProps) {
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
						<LevelAndRaceEditableDisplay
							level={level}
							race={race}
						/>
					}
					colum2={<AttributesEditableDisplay />}
				/>
			</UIBasics.Box>
			<UIBasics.MultiColumn.Two
				withoutPadding
				colum1={<GaugesTable />}
				colum2={<MiscsTable />}
			/>
		</UIBasics.Box>
	);
}
