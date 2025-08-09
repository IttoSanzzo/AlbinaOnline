import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
import {
	CharacterCoinStack,
	CharacterEquipments,
	CharacterItemStackExpanded,
	Guid,
} from "@/libs/stp@types";
import React from "react";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";

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
			<NotionBox
				backgroundColor="gray"
				withoutMargin
				withoutBorder>
				<Notion2Columns
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
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
