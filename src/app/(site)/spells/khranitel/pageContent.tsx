import { GenericPageContainer } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import SpellTypeDisplay from "../subComponents/SpellTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Nível 0", id: "Nível 0" },
	{ name: "Nível 1", id: "Nível 1" },
	{ name: "Nível 2", id: "Nível 2" },
	{ name: "Nível 3", id: "Nível 3" },
	{ name: "Nível 4", id: "Nível 4" },
	{ name: "Nível 5", id: "Nível 5" },
	{ name: "Nível 6", id: "Nível 6" },
	{ name: "Nível 7", id: "Nível 7" },
	{ name: "Nível 8", id: "Nível 8" },
	{ name: "Nível 9", id: "Nível 9" },
	{ name: "Nível 10", id: "Nível 10" },
	{ name: "Nível 11", id: "Nível 11" },
	{ name: "Nível 12", id: "Nível 12" },
];

export default async function KhranitelPageContent() {
	const response = await fetch(getAlbinaApiFullAddress("/spells"), {
		cache: getCacheMode(),
	});
	const allRawSpells: SpellData[] = await response.json();

	const allSpells: SpellData[] = allRawSpells.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Domínio Khranitel"
			icon={getAlbinaApiFullAddress("/favicon/spells/khranitel")}
			banner={getAlbinaApiFullAddress("/banner/spells/khranitel")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<SpellTypeDisplay
				allSpells={allSpells}
				domain="Khranitel"
			/>
		</GenericPageContainer>
	);
}
