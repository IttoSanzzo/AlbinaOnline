import {
	CharacterEquipments,
	EquipmentSlot,
	Guid,
	ItemData,
} from "@/libs/stp@types";
import React, { useContext, useLayoutEffect, useState } from "react";
import { EquipmentsContext } from "../../../../CharacterEditableSheetContextProviders/contexts/Equipments";
import { StyledLinkWithButton } from "@/components/(Design)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

export async function handleRemoveEquipedItem(
	characterId: Guid,
	itemId: Guid,
	slot: EquipmentSlot,
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>
) {
	const body = {
		itemId: itemId,
		slot: EquipmentSlot[slot] as keyof typeof EquipmentSlot,
	};
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(`/chars/${characterId}/equipments`),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (!response.ok) return;
	setCharacterEquipments((state) => ({
		...state,
		slots: {
			...state.slots,
			[body.slot]: state.slots[body.slot]?.filter((id) => id !== itemId) ?? [],
		},
	}));
}

interface EquipedItemDisplayProps {
	characterId: Guid;
	itemId: Guid;
	slot: EquipmentSlot;
}
function _EquipedItemDisplay({
	characterId,
	itemId,
	slot,
}: EquipedItemDisplayProps) {
	const { setCharacterEquipments } = useContext(EquipmentsContext);
	const [itemData, setItemData] = useState<ItemData | null>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/items?id=${itemId}`), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (response) => {
			if (!response.ok) throw new Error("Failed to fetch masteries");
			const data: ItemData = await response.json();
			setItemData(data);
		});
	}, [itemId]);
	if (itemData === null) return null;

	return (
		<StyledLinkWithButton
			title={itemData.name}
			href={`/items/${itemData.slug}`}
			icon={itemData.iconUrl}
			buttonIcon={{ name: "Trash", color: "red" }}
			onClick={async () =>
				await handleRemoveEquipedItem(
					characterId,
					itemId,
					slot,
					setCharacterEquipments
				)
			}
		/>
	);
}

const areEqual = (
	prevProps: EquipedItemDisplayProps,
	nextProps: EquipedItemDisplayProps
) =>
	prevProps.characterId === nextProps.characterId &&
	prevProps.itemId === nextProps.itemId;
export const EquipedItemDisplay = React.memo(_EquipedItemDisplay, areEqual);
