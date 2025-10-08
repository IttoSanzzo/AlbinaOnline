import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import PageContent from "./pageContent";
import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getCacheMode } from "@/utils/Cache";
import { MasteryData } from "@/libs/stp@types";

export const metadata: Metadata = {
	title: "Maestrias",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/maestrias"),
	},
};

const anchorNavigationData: AnchorProps[] = [
	{ name: "Proficiências", id: "Proficiências" },
	{ name: "Perícias", id: "Perícias" },
	{ name: "Conhecimentos", id: "Conhecimentos" },
	{ name: "Ofícios", id: "Ofícios" },
];

export default async function MasteriesPageServerShell() {
	const response = await fetch(getAlbinaApiAddress("/maestrias"), {
		cache: getCacheMode(),
	});
	const allRawMasteries: MasteryData[] = await response.json();
	const masteries: MasteryData[] = allRawMasteries.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Maestrias"
			icon={getAlbinaApiAddress("/favicon/core-page/masteries")}
			banner={getAlbinaApiAddress("/banner/core-page/masteries")}>
			<UIBasics.Divisor />
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageContent masteries={masteries} />
			<GenericPageFooter version="7.0.0" />
		</GenericPageContainer>
	);
}
