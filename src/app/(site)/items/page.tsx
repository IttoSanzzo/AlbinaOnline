import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { ItemData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import ItemTypeDisplay from "./subComponents/ItemTypeDisplay";

// type ItemData

export default async function Items() {
	const response = await fetch(`${process.env.ALBINA_API}/items`, {
		cache: await getCacheMode(),
	});
	const allRawItems: ItemData[] = await response.json();
	const allItems: ItemData[] = allRawItems.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	const allArmaments = allItems.filter((item) => item.type === "armament");
	const allFocuses = allItems.filter((item) => item.type === "focus");
	const allShieldings = allItems.filter((item) => item.type === "shielding");
	const allFrames = allItems.filter((item) => item.type === "frame");
	const allWearables = allItems.filter((item) => item.type === "wearable");
	const allAccessories = allItems.filter((item) => item.type === "accessory");
	const allConsumables = allItems.filter((item) => item.type === "consumable");
	const allSpecials = allItems.filter((item) => item.type === "special");
	const allMiscellaneous = allItems.filter(
		(item) => item.type === "miscellaneous"
	);

	return (
		<GenericPageContainer title="Todos os Items">
			<ItemTypeDisplay
				title="Armamentos"
				items={allArmaments}
			/>
			<ItemTypeDisplay
				title="Focus"
				items={allFocuses}
			/>
			<ItemTypeDisplay
				title="Escudos"
				items={allShieldings}
			/>
			<ItemTypeDisplay
				title="Frames"
				items={allFrames}
			/>
			<ItemTypeDisplay
				title="Vestimentas Complementares"
				items={allWearables}
			/>
			<ItemTypeDisplay
				title="Acessórios"
				items={allAccessories}
			/>
			<ItemTypeDisplay
				title="Consumíveis"
				items={allConsumables}
			/>
			<ItemTypeDisplay
				title="Especiais"
				items={allSpecials}
			/>
			<ItemTypeDisplay
				title="Miscelâneos"
				items={allMiscellaneous}
			/>
		</GenericPageContainer>
	);
}
