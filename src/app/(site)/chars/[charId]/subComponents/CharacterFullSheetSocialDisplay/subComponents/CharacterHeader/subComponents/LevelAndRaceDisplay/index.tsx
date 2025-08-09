import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { RaceData } from "@/libs/stp@types";
import { StyledLink } from "@/components/(Design)";

interface LevelAndRaceDisplayProps {
	level: number;
	race: RaceData;
}
export function LevelAndRaceDisplay({ level, race }: LevelAndRaceDisplayProps) {
	return (
		<NotionTable
			direction="column"
			withoutMargin
			withoutBorderRadius
			tableData={{
				tableLanes: [
					[
						<NotionText
							textColor="gray"
							children={"Nível"}
						/>,
						<NotionText
							textColor="orange"
							display="block"
							textAlign="center"
							children={level.toString()}
						/>,
					],
					[
						<NotionText
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
