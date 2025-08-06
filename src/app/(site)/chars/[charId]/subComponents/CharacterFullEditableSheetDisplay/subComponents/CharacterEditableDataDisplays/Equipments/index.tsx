import {
	Notion2Columns,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { useContext, useLayoutEffect } from "react";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import {
	CharacterEquipments,
	CharacterItemStackExpanded,
	EquipmentSlot,
	Guid,
} from "@/libs/stp@types";
import React from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { EquipmentsContext } from "../../CharacterEditableSheetContextProviders/contexts/Equipments";
import { EquipedItemDisplay } from "./subComponents/EquipedItemDisplay";
import { NotionGridList } from "@/components/(UTILS)";
import { AddEquipmentButton } from "./subComponents/AddEquipmentButton";

async function handleItemRemoval(
	characterId: Guid,
	itemId: Guid,
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>
) {
	const body = { itemId: itemId };
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(`/chars/${characterId}/items`),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (!response.ok) return;
	setCharacterItems((state) => state.filter((item) => item.item.id != itemId));
}

function formEquipSlotTableEntry(
	characterId: Guid,
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>,
	slot: EquipmentSlot,
	title: string,
	itemIds?: Guid[]
) {
	return [
		<div style={{ position: "relative" }}>
			<AddEquipmentButton
				characterId={characterId}
				setCharacterEquipments={setCharacterEquipments}
				title={title}
				slot={slot}
				alreadyHasItemIds={itemIds}
			/>
			<NotionText
				display="block"
				textAlign="center"
				children={title}
			/>
		</div>,
		<NotionGridList
			withoutBorder
			withoutMargin
			withoutPadding
			children={itemIds?.map((itemId) => (
				<EquipedItemDisplay
					key={itemId}
					characterId={characterId}
					slot={slot}
					itemId={itemId}
				/>
			))}
		/>,
	];
}

export function _CharacterEquipmentsDisplay() {
	const { characterEquipments, setCharacterEquipments } =
		useContext(EquipmentsContext);
	const { characterId } = useContext(CharacterIdContext);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/equipments`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then(async (response) => {
			if (!response.ok) throw new Error("Failed to fetch masteries");
			const data: CharacterEquipments = await response.json();
			setCharacterEquipments(data);
		});
	}, [characterId]);
	if (characterEquipments == null) return null;

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
						fixedLineWidths={[50]}
						columnBackgroundColors={[undefined, "gray"]}
						tableData={{
							tableLanes: [
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Frame,
									"Frame",
									characterEquipments.slots.Frame
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.MainHand,
									"Mão Principal",
									characterEquipments.slots.MainHand
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.OffHand,
									"Mão Secundária",
									characterEquipments.slots.OffHand
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Head,
									"Cabeça",
									characterEquipments.slots.Head
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Feet,
									"Pés",
									characterEquipments.slots.Feet
								),
							],
						}}
					/>
				}
				colum2={
					<NotionTable
						fixedLinePositions={[1]}
						fixedLineWidths={[30]}
						columnBackgroundColors={[undefined, "gray"]}
						tableData={{
							tableLanes: [
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Torso,
									"Corpo",
									characterEquipments.slots.Torso
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Arms,
									"Braços",
									characterEquipments.slots.Arms
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Face,
									"Rosto",
									characterEquipments.slots.Face
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Waist,
									"Cinto",
									characterEquipments.slots.Waist
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Earring,
									"Brinco",
									characterEquipments.slots.Earring
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Necklace,
									"Colar",
									characterEquipments.slots.Necklace
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Bracelet,
									"Pulseira",
									characterEquipments.slots.Bracelet
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.Ring,
									"Anel",
									characterEquipments.slots.Ring
								),
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
