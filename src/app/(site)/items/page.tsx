import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { getCacheMode } from "@/utils/Cache";
import { ItemData } from "@/libs/stp@types";
import PageContent from "./pageContent";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";
import { assembleMetadata } from "@/metadata/assembleMetadata";

export const metadata: Metadata = assembleMetadata({
	title: "Items",
	icon: getAlbinaApiFullAddress("/favicon/core-page/items"),
	ogImage: {
		url: getAlbinaApiFullAddress("/banner/core-page/items"),
	},
	route: "/items",
});

const anchorNavigationData = [
	{ name: "Armamentos" },
	{ name: "Focus" },
	{ name: "Escudos" },
	{ name: "Frames" },
	{ name: "Vestimentas Auxiliares" },
	{ name: "Acessórios" },
	{ name: "Consumíveis" },
	{ name: "Miscelaneos" },
	{ name: "Ferramentas" },
	{ name: "Kits" },
	{ name: "Veículos" },
	{ name: "Especiais" },
	{ name: "Aleatórios" },
];

export default async function ItemsPageServerShell() {
	const response = await fetch(getAlbinaApiFullAddress("/items"), {
		cache: getCacheMode(),
		next: { tags: [`/items`] },
	});
	const items: ItemData[] = await response.json();
	const ordenedItems = items.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Todos os Items"
			icon={getAlbinaApiFullAddress("/favicon/core-page/items")}
			banner={getAlbinaApiFullAddress("/banner/core-page/items")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageContent items={ordenedItems} />
		</GenericPageContainer>
	);
}
