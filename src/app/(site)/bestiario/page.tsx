import { Metadata } from "next";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import PageView from "./page.view";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";

export const metadata: Metadata = assembleMetadata({
	title: "Bestiário",
	icon: getAlbinaApiFullAddress("/favicon/core-page/bestiary"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/bestiary"),
	},
	route: "/bestiario",
});

// const anchorNavigationData = [{ name: "" }]; // TODO

export default function BestiaryPage() {
	return (
		<GenericPageContainer
			title="Bestiário"
			icon={getAlbinaApiFullAddress("/favicon/core-page/bestiary")}
			banner={getAlbinaApiFullAddress("/banner/core-page/bestiary")}>
			<SetAnchorNavigation anchors={[]} />
			<PageView />
		</GenericPageContainer>
	);
}
