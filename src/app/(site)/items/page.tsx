import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { getCacheMode } from "@/utils/Cache";
import { ItemData } from "@/libs/stp@types";
import PageContent from "./pageContent";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";

export const metadata: Metadata = {
	title: "Items",
	icons: {
		icon: getAlbinaApiFullAddress("/favicon/core-page/items"),
	},
};

const anchorNavigationData = [
	{ name: "Armamentos", id: "armamentos" },
	{ name: "Focus", id: "focus" },
	{ name: "Escudos", id: "escudos" },
	{ name: "Frames", id: "frames" },
	{ name: "Vestimentas Auxiliares", id: "vestimentas-auxiliares" },
	{ name: "Acessórios", id: "acessorios" },
	{ name: "Consumíveis", id: "consumiveis" },
	{ name: "Miscelaneos", id: "miscelaneos" },
	{ name: "Ferramentas", id: "ferramentas" },
	{ name: "Especiais", id: "especiais" },
	{ name: "Aleatórios", id: "aleatorios" },
];

export default async function ItemsPageServerShell() {
	const response = await fetch(getAlbinaApiFullAddress("/items"), {
		cache: getCacheMode(),
	});
	const items: ItemData[] = await response.json();
	const ordenedItems = items.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Todos os Items"
			icon={getAlbinaApiFullAddress("/favicon/core-page/items")}
			banner={getAlbinaApiFullAddress("/banner/core-page/items")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageContent items={ordenedItems} />;
		</GenericPageContainer>
	);
}
