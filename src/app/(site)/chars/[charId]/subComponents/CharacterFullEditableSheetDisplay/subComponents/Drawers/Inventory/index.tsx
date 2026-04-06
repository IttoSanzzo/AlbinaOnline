import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterCoinStack, Guid } from "@/libs/stp@types";
import React from "react";

interface InventoryDrawerProps {
	characterId: Guid;
	characterCoinStacks: CharacterCoinStack[];
}
function _InventoryDrawer({
	characterId,
	characterCoinStacks,
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
					colum1={<CharacterEditableDataDisplays.ItemStacks />}
					colum2={
						<CharacterEditableDataDisplays.CoinStacks
							characterCoinStacks={characterCoinStacks}
						/>
					}
				/>
				<CharacterEditableDataDisplays.Equipments />
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}

export const InventoryDrawer = React.memo(_InventoryDrawer);
