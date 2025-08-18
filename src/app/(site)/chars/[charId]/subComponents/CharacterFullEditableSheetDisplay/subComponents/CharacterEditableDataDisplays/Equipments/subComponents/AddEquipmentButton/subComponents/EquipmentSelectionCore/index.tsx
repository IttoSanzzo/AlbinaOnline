import {
	CharacterEquipments,
	CharacterItemStackExpanded,
	EquipmentSlot,
	EquipmentSlotType,
	Guid,
	isSlotCompatibleWithType,
	ItemData,
} from "@/libs/stp@types";
import { useContext, useMemo } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { ItemsContext } from "../../../../../../CharacterEditableSheetContextProviders/contexts/Items";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";

interface EquipmentSelectionCoreProps {
	characterId: Guid;
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>;
	slot: EquipmentSlot;
	alreadyHasItemIds: Guid[];
}
export function EquipmentSelectionCore({
	characterId,
	alreadyHasItemIds,
	setCharacterEquipments,
	slot,
}: EquipmentSelectionCoreProps) {
	const { characterItems } = useContext(ItemsContext);

	const ownedItemsForThisSlot: CharacterItemStackExpanded[] = useMemo(
		() =>
			characterItems.filter((itemStack) =>
				itemStack.item.properties.compatibleSlots.some((slotType) =>
					isSlotCompatibleWithType(slot, EquipmentSlotType[slotType])
				)
			),
		[characterItems]
	);

	const unequippedItemIds: CharacterItemStackExpanded[] =
		ownedItemsForThisSlot.filter(
			(itemStacks) =>
				!alreadyHasItemIds.some((itemId) => itemStacks.itemId === itemId)
		);

	async function handleAddEquipment(item: ItemData) {
		const body = {
			itemId: item.id,
			slot: EquipmentSlot[slot] as keyof typeof EquipmentSlot,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/equipments`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setCharacterEquipments((state) => ({
			...state,
			slots: {
				...state.slots,
				[body.slot]: [...(state.slots[body.slot] ?? []), item.id],
			},
		}));
	}

	if (unequippedItemIds.length === 0) {
		return (
			<UIBasics.Header
				textColor="gray"
				textAlign="center">
				Não há item desse tipo para equipar.
			</UIBasics.Header>
		);
	}
	return (
		<UIBasics.List.Grid
			columnWidth={300}
			direction="column"
			backgroundColor="gray"
			children={unequippedItemIds.map((unequippedItemId) => {
				return (
					<Dialog.Close
						key={unequippedItemId.item.id}
						asChild>
						<StyledLinklikeButton
							title={unequippedItemId.item.name}
							icon={unequippedItemId.item.iconUrl}
							onClick={() => handleAddEquipment(unequippedItemId.item)}
						/>
					</Dialog.Close>
				);
			})}
		/>
	);
}
