import { GenericPageContainer } from "@/components/(Design)";
import { ItemData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import ItemTypeDisplay from "./subComponents/ItemTypeDisplay";
import { SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { UIBasics } from "@/components/(UIBasics)";

const anchorNavigationData = [
	{ name: "Armamentos", id: "armamentos" },
	{ name: "Focus", id: "focus" },
	{ name: "Escudos", id: "escudos" },
	{ name: "Frames", id: "frames" },
	{ name: "Vestimentas Auxiliares", id: "vestimentas-auxiliares" },
	{ name: "Acessórios", id: "acessorios" },
	{ name: "Consumíveis", id: "consumiveis" },
	{ name: "Miscelaneos", id: "miscelaneos" },
	{ name: "Especiais", id: "especiais" },
];

export default async function ItemsPageContent() {
	const response = await fetch(getAlbinaApiAddress("/items"), {
		cache: getCacheMode(),
	});
	const allRawItems: ItemData[] = await response.json();
	const allItems: ItemData[] = allRawItems.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todos os Items"
			icon={getAlbinaApiAddress("/favicon/core-page/items")}
			banner={getAlbinaApiAddress("/banner/core-page/items")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<UIBasics.Box
				backgroundColor="darkGray"
				withoutMargin>
				<ItemTypeDisplay
					title="Armamentos"
					allItems={allItems}
					type="Armament"
				/>
				<ItemTypeDisplay
					title="Focus"
					allItems={allItems}
					type="Focus"
				/>
				<ItemTypeDisplay
					title="Escudos"
					allItems={allItems}
					type="Shielding"
				/>
				<ItemTypeDisplay
					title="Frames"
					allItems={allItems}
					type="Frame"
				/>
				<ItemTypeDisplay
					title="Vestimentas Auxiliares"
					allItems={allItems}
					type="Wearable"
				/>
				<ItemTypeDisplay
					title="Acessórios"
					allItems={allItems}
					type="Accessory"
				/>
				<ItemTypeDisplay
					title="Consumíveis"
					allItems={allItems}
					type="Consumable"
				/>
				<ItemTypeDisplay
					title="Miscelâneos"
					allItems={allItems}
					type="Miscellaneous"
				/>
				<ItemTypeDisplay
					title="Especiais"
					allItems={allItems}
					type="Special"
				/>
			</UIBasics.Box>
		</GenericPageContainer>
	);
}
