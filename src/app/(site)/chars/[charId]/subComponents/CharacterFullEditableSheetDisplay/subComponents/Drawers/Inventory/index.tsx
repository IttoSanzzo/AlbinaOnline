import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import {
	Notion2Columns,
	NotionBox,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterCoinStack } from "@/libs/stp@types";
import React from "react";

interface InventoryDrawerProps {
	characterId: string;
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
			<NotionBox
				backgroundColor="gray"
				withoutMargin
				withoutBorder>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<NotionToggleHeader
							backgroundColor="darkGray"
							titleColor="blue"
							title="Items"></NotionToggleHeader>
					}
					colum2={
						<CharacterEditableDataDisplays.CoinStacks
							characterCoinStacks={characterCoinStacks}
						/>
					}
				/>

				<NotionToggleHeader
					backgroundColor="darkGray"
					titleColor="green"
					title="Equipados"></NotionToggleHeader>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}

function areEqual(
	prevProps: InventoryDrawerProps,
	nextProps: InventoryDrawerProps
) {
	return (
		prevProps.characterId === nextProps.characterId &&
		prevProps.characterCoinStacks === nextProps.characterCoinStacks
	);
}
export const InventoryDrawer = React.memo(_InventoryDrawer, areEqual);
