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
			icon={`${process.env.ALBINA_API}/favicon/racas`}
			banner={`${process.env.ALBINA_API}/banner/racas`}>
			<RaceTypeDisplay
				title="Humanos"
				allRaces={allRaces}
				type="Human"
			/>
			<RaceTypeDisplay
				title="Feéricos"
				allRaces={allRaces}
				type="Fey"
			/>
			<RaceTypeDisplay
				title="Demônios"
				allRaces={allRaces}
				type="Demon"
			/>
			<RaceTypeDisplay
				title="Dracônicos"
				allRaces={allRaces}
				type="Dragon"
			/>
			<RaceTypeDisplay
				title="Seireis"
				allRaces={allRaces}
				type="Seirei"
			/>
		</GenericPageContainer>
	);
}
