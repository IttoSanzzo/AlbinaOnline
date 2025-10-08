import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { Metadata } from "next";
import { getCacheMode } from "@/utils/Cache";
import { ItemData } from "@/libs/stp@types";
import PageContent from "./pageContent";
import { GenericPageContainer } from "@/components/(Design)";
import { SetAnchorNavigation } from "@/libs/stp@hooks";

export const metadata: Metadata = {
	title: "Items",
	icons: {
		icon: getAlbinaApiAddress("/favicon/core-page/items"),
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
	const response = await fetch(getAlbinaApiAddress("/items"), {
		cache: getCacheMode(),
	});
	const items: ItemData[] = await response.json();
	const ordenedItems = items.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<GenericPageContainer
			title="Todos os Items"
			icon={getAlbinaApiAddress("/favicon/core-page/items")}
			banner={getAlbinaApiAddress("/banner/core-page/items")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />
			<PageContent items={ordenedItems} />;
		</GenericPageContainer>
	);
}
