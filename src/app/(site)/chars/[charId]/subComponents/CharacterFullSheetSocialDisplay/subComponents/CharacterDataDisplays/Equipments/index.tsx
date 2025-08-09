import {
	Notion2Columns,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { CharacterEquipments, EquipmentSlot, Guid } from "@/libs/stp@types";
import React from "react";
import { EquipedItemDisplay } from "./subComponents/EquipedItemDisplay";

function formEquipSlotTableEntry(title: string, itemIds?: Guid[]) {
	return [
		<NotionText
			display="block"
			textAlign="center"
			children={title}
		/>,
		<NotionGridList
			withoutBorder
			withoutMargin
			withoutPadding
			children={itemIds?.map((itemId) => (
				<EquipedItemDisplay
					key={itemId}
					itemId={itemId}
				/>
			))}
		/>,
	];
}

interface CharacterEquipmentsDisplayProps {
	characterId: Guid;
	characterEquipments: CharacterEquipments;
}
export function _CharacterEquipmentsDisplay({
	characterId,
	characterEquipments,
}: CharacterEquipmentsDisplayProps) {
	return (
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="green"
			title="Equipamentos"
			memoryId={`${characterId}-Equipments`}>
			<Notion2Columns
				colum1={
					<NotionTable
						fixedLinePositions={[1]}
						fixedLineWidths={[45]}
						columnBackgroundColors={[undefined, "gray"]}
						tableData={{
							tableLanes: [
								formEquipSlotTableEntry(
									"Frame",
									characterEquipments.slots.Frame
								),
								formEquipSlotTableEntry(
									"Mão Hábil",
									characterEquipments.slots.MainHand
								),
								formEquipSlotTableEntry(
									"Outra Mão",
									characterEquipments.slots.OffHand
								),
								formEquipSlotTableEntry(
									"Cabeça",
									characterEquipments.slots.Head
								),
								formEquipSlotTableEntry("Pés", characterEquipments.slots.Feet),
							],
						}}
					/>
				}
				colum2={
					<NotionTable
						fixedLinePositions={[1]}
						fixedLineWidths={[40]}
						columnBackgroundColors={[undefined, "gray"]}
						tableData={{
							tableLanes: [
								formEquipSlotTableEntry(
									"Corpo",
									characterEquipments.slots.Torso
								),
								formEquipSlotTableEntry(
									"Braços",
									characterEquipments.slots.Arms
								),
								formEquipSlotTableEntry(
									"Rosto",
									characterEquipments.slots.Face
								),
								formEquipSlotTableEntry(
									"Cinto",
									characterEquipments.slots.Waist
								),
								formEquipSlotTableEntry(
									"Brinco",
									characterEquipments.slots.Earring
								),
								formEquipSlotTableEntry(
									"Colar",
									characterEquipments.slots.Necklace
								),
								formEquipSlotTableEntry(
									"Pulseira",
									characterEquipments.slots.Bracelet
								),
								formEquipSlotTableEntry("Anel", characterEquipments.slots.Ring),
							],
						}}
					/>
				}
			/>
		</NotionToggleHeader>
	);
}

export const CharacterEquipmentsDisplay = React.memo(
	_CharacterEquipmentsDisplay
);
