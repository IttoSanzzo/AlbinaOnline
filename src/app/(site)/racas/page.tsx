import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { RaceData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import RaceTypeDisplay from "./subComponents/RaceTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Humanos", id: "Humanos" },
	{ name: "Feéricos", id: "Feéricos" },
	{ name: "Demônios", id: "Demônios" },
	{ name: "Dracônicos", id: "Dracônicos" },
	{ name: "Seireis", id: "Seireis" },
];

export default async function RacesPage() {
	const response = await fetch(`${process.env.ALBINA_API}/races`, {
		cache: getCacheMode(),
	});
	const allRawRaces: RaceData[] = await response.json();
	const allRaces: RaceData[] = allRawRaces.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Raças"
			icon={`${process.env.ALBINA_API}/favicon/core-page/races`}
			banner={`${process.env.ALBINA_API}/banner/core-page/races`}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

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
