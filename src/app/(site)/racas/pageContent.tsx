import { GenericPageContainer } from "@/components/(Design)";
import { RaceData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import RaceTypeDisplay from "./subComponents/RaceTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Humanos", id: "Humanos" },
	{ name: "Feéricos", id: "Feéricos" },
	{ name: "Demônios", id: "Demônios" },
	{ name: "Dracônicos", id: "Dracônicos" },
	{ name: "Seireis", id: "Seireis" },
];

export default async function RacesPageContent() {
	const response = await fetch(getAlbinaApiFullAddress("/races"), {
		cache: getCacheMode(),
	});
	const allRawRaces: RaceData[] = await response.json();
	const allRaces: RaceData[] = allRawRaces.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Raças"
			icon={getAlbinaApiFullAddress("/favicon/core-page/races")}
			banner={getAlbinaApiFullAddress("/banner/core-page/races")}>
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
