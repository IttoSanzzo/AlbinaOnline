import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
// import { getCacheMode } from "@/utils/Cache";
// import { ItemData } from "@/libs/stp@types";
// import PageContent from "./pageContent";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";
import { assembleMetadata } from "@/metadata/assembleMetadata";

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
	// const response = await fetch(getAlbinaApiFullAddress("/items"), {
	// 	cache: getCacheMode(),
	// 	next: { tags: [`/items`] },
	// });
	// const items: ItemData[] = await response.json();
	// const ordenedItems = items.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Todos as Localizações"
			icon={getAlbinaApiFullAddress("/favicon/core-page/atlas")}
			banner={getAlbinaApiFullAddress("/banner/core-page/atlas")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			{/* <PageContent items={ordenedItems} /> */}
		</GenericPageContainer>
	);
}
