import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
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
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				textAlign="center"
				children={title}
			/>
			<NotionGridList
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
		</NotionBox>
	);
}
