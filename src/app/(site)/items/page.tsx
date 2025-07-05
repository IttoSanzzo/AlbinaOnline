import { GenericPageContainer } from "@/components/(Design)";
import { ItemData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import ItemTypeDisplay from "./subComponents/ItemTypeDisplay";

export default async function Items() {
	const response = await fetch(`${process.env.ALBINA_API}/items`, {
		cache: await getCacheMode(),
	});
	const allRawItems: ItemData[] = await response.json();
	const allItems: ItemData[] = allRawItems.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todos os Items"
			icon={`${process.env.ALBINA_API}/favicon/core-page/items`}
			banner={`${process.env.ALBINA_API}/banner/core-page/items`}
			anchors={[
				{ name: "Armamentos", id: "armamentos" },
				{ name: "Focus", id: "focus" },
				{ name: "Escudos", id: "escudos" },
				{ name: "Frames", id: "frames" },
				{ name: "Vestimentas Auxiliares", id: "vestimentas-auxiliares" },
				{ name: "Acessórios", id: "acessorios" },
				{ name: "Consumíveis", id: "consumiveis" },
				{ name: "Miscelaneos", id: "miscelaneos" },
				{ name: "Especiais", id: "especiais" },
			]}>
			<ItemTypeDisplay
				title="Armamentos"
				allItems={allItems}
				type="Armament"
				// subTypesOrder={[
				// 	"shortBlade",
				// 	"sword",
				// 	"axe",
				// 	"bow",
				// 	"crossbow",
				// 	"polearm",
				// 	"concussiveWeapon",
				// 	"fireWeapon",
				// 	"tetheredWeapon",
				// 	"bluntWeapon",
				// ]}
			/>
			<ItemTypeDisplay
				title="Focus"
				allItems={allItems}
				type="Focus"
				// subTypesOrder={["grimoire", "staff", "scepter", "wand", "orb"]}
			/>
			<ItemTypeDisplay
				title="Escudos"
				allItems={allItems}
				type="Shielding"
				// subTypesOrder={["lightShield", "mediumShield", "heavyShield"]}
			/>
			<ItemTypeDisplay
				title="Frames"
				allItems={allItems}
				type="Frame"
				// subTypesOrder={["lightFrame", "mediumFrame", "heavyFrame"]}
			/>
			<ItemTypeDisplay
				title="Vestimentas Auxiliares"
				allItems={allItems}
				type="Wearable"
				// subTypesOrder={[
				// 	"footGear",
				// 	"headGear",
				// 	"handGear",
				// 	"armGear",
				// 	"robe",
				// 	"cape",
				// ]}
			/>
			<ItemTypeDisplay
				title="Acessórios"
				allItems={allItems}
				type="Accessory"
				// subTypesOrder={["mask", "earring", "necklace", "ring", "other"]}
			/>
			<ItemTypeDisplay
				title="Consumíveis"
				allItems={allItems}
				type="Consumable"
				// subTypesOrder={["ammo", "potion", "medicine", "scroll", "food"]}
			/>
			<ItemTypeDisplay
				title="Miscelâneos"
				allItems={allItems}
				type="Miscellaneous"
				// subTypesOrder={["tool", "kit", "ingredient", "material", "book"]}
			/>
			<ItemTypeDisplay
				title="Especiais"
				allItems={allItems}
				type="Special"
				// subTypesOrder={["token", "relic", "other"]}
			/>
		</GenericPageContainer>
	);
}
