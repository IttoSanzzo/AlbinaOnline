import { RaceData } from "@/libs/stp@types";
import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";

interface LevelAndRaceDisplayProps {
	level: number;
	race: RaceData;
}
export function LevelAndRaceDisplay({ level, race }: LevelAndRaceDisplayProps) {
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
						<UIBasics.Text
							textColor="orange"
							display="block"
							textAlign="center"
							children={level.toString()}
						/>,
					],
					[
						<UIBasics.Text
							textColor="gray"
							children={"Raça"}
						/>,
						<StyledLink
							href={`/racas/${race.slug}`}
							icon={race.iconUrl}
							title={race.name}
						/>,
					],
				],
			}}
		/>
	);
}
