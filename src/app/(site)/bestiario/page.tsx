import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";
import { CreatureData } from "@/libs/stp@types";

export const metadata: Metadata = assembleMetadata({
	title: "Bestiário",
	icon: getAlbinaApiFullAddress("/favicon/core-page/bestiary"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/bestiary"),
	},
	route: "/bestiario",
});

// const anchorNavigationData = [{ name: "" }]; // TODO

export default async function BestiaryPage() {
	const response = await fetch(getAlbinaApiFullAddress("/bestiary"), {
		next: { tags: ["/bestiary"] },
	});
	const entities = (
		(response.ok ? await response.json() : []) as CreatureData[]
	).sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Bestiário"
			icon={getAlbinaApiFullAddress("/favicon/core-page/bestiary")}
			banner={getAlbinaApiFullAddress("/banner/core-page/bestiary")}>
			<SetAnchorNavigation anchors={[]} />
			<PageView entities={entities} />
		</GenericPageContainer>
	);
}
