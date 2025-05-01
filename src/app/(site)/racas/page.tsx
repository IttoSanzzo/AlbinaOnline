import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { RaceData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import RaceTypeDisplay from "./subComponents/RaceTypeDisplay";

export default async function Races() {
	const response = await fetch(`${process.env.ALBINA_API}/races`, {
		cache: await getCacheMode(),
	});
	const allRawRaces: RaceData[] = await response.json();
	const allRaces: RaceData[] = allRawRaces.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Raças"
			anchors={[]}
			icon={`${process.env.ALBINA_API}/favicon/races`}
			banner={`${process.env.ALBINA_API}/banner/races`}>
			<RaceTypeDisplay
				title="Feéricos"
				allRaces={allRaces}
				type="fey"
			/>
		</GenericPageContainer>
	);
}
