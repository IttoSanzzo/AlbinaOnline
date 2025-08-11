import { RaceData } from "@/libs/stp@types";
import { useContext, useState } from "react";
import { CharacterIdContext } from "../../../CharacterEditableSheetContextProviders";
import { LevelSelector } from "./subComponents/LevelSelector";
import { RaceSelector } from "./subComponents/RaceSelector";
import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";

interface LevelAndRaceEditableDisplayProps {
	level: number;
	race: RaceData;
}
export function LevelAndRaceEditableDisplay({
	level,
	race,
}: LevelAndRaceEditableDisplayProps) {
	const [raceState, setRaceState] = useState<RaceData>(race);
	const { characterId } = useContext(CharacterIdContext);

	return (
		<UIBasics.Table
			direction="column"
			withoutMargin
			withoutBorderRadius
			tableData={{
				tableLanes: [
					[
						<UIBasics.Text
							textColor="gray"
							children={"Nível"}
						/>,
						<LevelSelector
							characterId={characterId}
							level={level}
						/>,
					],
					[
						<div style={{ position: "relative" }}>
							<UIBasics.Text
								textColor="gray"
								children={"Raça"}
							/>
							<RaceSelector
								characterId={characterId}
								race={raceState}
								setRace={setRaceState}
							/>
						</div>,
						<StyledLink
							href={`/racas/${raceState.slug}`}
							icon={raceState.iconUrl}
							title={raceState.name}
						/>,
					],
				],
			}}
		/>
	);
}
