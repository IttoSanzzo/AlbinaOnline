import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { GenericPageContainer } from "@/components/(Design)";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getCacheMode } from "@/utils/Cache";
import { SpellData } from "@/libs/stp@types";
import PageContent from "./pageContent";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Spells",
	icon: getAlbinaApiFullAddress("/favicon/core-page/spells"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/spells"),
	},
	route: "/spells",
});

const anchorNavigationData: AnchorProps[] = [
	{ name: "Domínios", id: "Domínios" },
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

export default async function SpellsPageServerShell() {
	const response = await fetch(getAlbinaApiFullAddress("/spells"), {
		cache: getCacheMode(),
	});
	const allRawSpells: SpellData[] = await response.json();
	const allSpells: SpellData[] = allRawSpells.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas os Spells"
			icon={getAlbinaApiFullAddress("/favicon/core-page/spells")}
			banner={getAlbinaApiFullAddress("/banner/core-page/spells")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageContent spells={allSpells} />
		</GenericPageContainer>
	);
}
