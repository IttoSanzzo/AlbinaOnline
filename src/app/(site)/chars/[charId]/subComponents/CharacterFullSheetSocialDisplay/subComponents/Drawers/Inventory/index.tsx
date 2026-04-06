import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import {
	CharacterCoinStack,
	CharacterEquipments,
	CharacterItemStackExpanded,
	Guid,
} from "@/libs/stp@types";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { UIBasics } from "@/components/(UIBasics)";

interface InventoryDrawerProps {
	characterId: Guid;
	characterCoinStacks: CharacterCoinStack[];
	characterItems: CharacterItemStackExpanded[];
	characterEquipments: CharacterEquipments;
}
export function InventoryDrawer({
	characterId,
	characterCoinStacks,
	characterEquipments,
	characterItems,
}: InventoryDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Inventário"
			memoryId={`${characterId}-Inventory`}>
			<UIBasics.Box
				backgroundColor="green"
				withoutMargin
				withoutBorder>
				<UIBasics.MultiColumn.Two
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterDataDisplays.ItemStacks
							characterId={characterId}
							characterItems={characterItems}
						/>
					}
					colum2={
						<CharacterDataDisplays.CoinStacks
							characterId={characterId}
							characterCoinStacks={characterCoinStacks}
						/>
					}
				/>
				<CharacterDataDisplays.Equipments
					characterId={characterId}
					characterEquipments={characterEquipments}
				/>
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
