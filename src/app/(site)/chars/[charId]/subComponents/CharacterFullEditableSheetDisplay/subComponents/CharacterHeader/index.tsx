import {
	Notion2Columns,
	NotionBox,
	NotionTable,
} from "@/components/(NotionBased)";
import { GaugesTable } from "./subComponents/GaugesTable";
import { MiscsTable } from "./subComponents/MiscsTable";
import { AttributesEditableDisplay } from "./subComponents/AttributesEditableDisplay";
import { LevelAndRaceEditableDisplay } from "./subComponents/LevelAndRaceEditableDisplay";
import { RaceData } from "@/libs/stp@types";
import { useState } from "react";

interface CharacterHeaderProps {
	level: number;
	race: RaceData;
}
export function CharacterHeader({ level, race }: CharacterHeaderProps) {
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
						<LevelAndRaceEditableDisplay
							level={level}
							race={race}
						/>
					}
					colum2={<AttributesEditableDisplay />}
				/>
			</NotionBox>
			<Notion2Columns
				withoutPadding
				colum1={<GaugesTable />}
				colum2={<MiscsTable />}
			/>
		</NotionBox>
	);
}
