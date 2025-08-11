import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { RaceData } from "@/libs/stp@types";

interface RaceTypeDisplayProps {
	allRaces: RaceData[];
	type: string;
	title: string;
}

export default function ItemTypeDisplay({
	allRaces,
	type,
	title,
}: RaceTypeDisplayProps) {
	const allRacesFromThisType = allRaces.filter((race) => race.type === type);

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				textAlign="center"
				children={title}
			/>
			<UIBasics.List.Grid
				backgroundColor="purple"
				children={allRacesFromThisType.map((race) => {
					return (
						<StyledLink
							key={race.id}
							title={race.name}
							href={`racas/${race.slug}`}
							icon={race.iconUrl}
						/>
					);
				})}
			/>
		</UIBasics.Box>
	);
}
