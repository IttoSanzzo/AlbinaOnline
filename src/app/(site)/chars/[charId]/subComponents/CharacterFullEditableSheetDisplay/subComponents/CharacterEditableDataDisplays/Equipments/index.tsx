import { useContext, useLayoutEffect } from "react";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { CharacterEquipments, EquipmentSlot, Guid } from "@/libs/stp@types";
import React from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { EquipmentsContext } from "../../CharacterEditableSheetContextProviders/contexts/Equipments";
import { EquipedItemDisplay } from "./subComponents/EquipedItemDisplay";
import { AddEquipmentButton } from "./subComponents/AddEquipmentButton";
import { UIBasics } from "@/components/(UIBasics)";

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
			<UIBasics.Text
				display="block"
				textAlign="center"
				children={title}
			/>
		</div>,
		<UIBasics.List.Grid
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
			getAlbinaApiFullAddress(`/chars/${characterId}/equipments`),
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
		<UIBasics.ToggleHeader
			defaultOpenState={true}
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="green"
			title="Equipamentos"
			memoryId={`${characterId}-Equipments`}>
			<UIBasics.MultiColumn.Two
				colum1={
					<UIBasics.Table
						fixedLinePositions={[1]}
						fixedLineWidths={[45]}
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
									"Mão Hábil",
									characterEquipments.slots.MainHand
								),
								formEquipSlotTableEntry(
									characterId,
									setCharacterEquipments,
									EquipmentSlot.OffHand,
									"Outra Mão",
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
					<UIBasics.Table
						fixedLinePositions={[1]}
						fixedLineWidths={[40]}
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
		</UIBasics.ToggleHeader>
	);
}

export const CharacterEquipmentsDisplay = React.memo(
	_CharacterEquipmentsDisplay
);
