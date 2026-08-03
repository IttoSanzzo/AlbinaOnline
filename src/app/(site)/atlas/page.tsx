import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";
import { assembleMetadata } from "@/metadata/assembleMetadata";
import { PageView } from "./page.view";

export const metadata: Metadata = assembleMetadata({
	title: "Atlas",
	icon: getAlbinaApiFullAddress("/favicon/core-page/atlas"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/atlas"),
	},
	route: "/atlas",
});

const anchorNavigationData = [{ name: "// TODO" }];

export default async function ItemsPageServerShell() {
	return (
		<GenericPageContainer
			title="Todos as Localizações"
			icon={getAlbinaApiFullAddress("/favicon/core-page/atlas")}
			banner={getAlbinaApiFullAddress("/banner/core-page/atlas")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageView />
		</GenericPageContainer>
	);
}
