import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import {
	Notion2Columns,
	NotionBox,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";

interface InventoryDrawerProps {
	characterId: string;
}
export function InventoryDrawer({ characterId }: InventoryDrawerProps) {
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
						<NotionToggleHeader
							backgroundColor="darkGray"
							titleColor="yellow"
							title="Moedas"></NotionToggleHeader>
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
