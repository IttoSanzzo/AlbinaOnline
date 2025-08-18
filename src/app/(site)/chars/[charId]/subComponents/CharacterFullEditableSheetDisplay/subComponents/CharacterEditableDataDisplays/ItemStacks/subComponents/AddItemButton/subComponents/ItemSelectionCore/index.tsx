import {
	CharacterItemStackExpanded,
	Guid,
	ItemData,
	ItemType,
	ItemTypePluralName,
} from "@/libs/stp@types";
import { useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface ItemSelectionCoreProps {
	characterId: Guid;
	characterItems: CharacterItemStackExpanded[];
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>;
}
export function ItemSelectionCore({
	characterId,
	characterItems,
	setCharacterItems,
}: ItemSelectionCoreProps) {
	const [allItems, setAllItems] = useState<ItemData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/items"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllItems(await response.json());
		});
	}, []);

	if (allItems.length == 0) return null;
	const unacquiredItems: ItemData[] = allItems
		.filter(
			(item) =>
				!characterItems.some((characterItem) => characterItem.itemId == item.id)
		)
		.sort((item1, item2) => item1.name.localeCompare(item2.name));
	const types = Object.values(ItemType).filter(
		(v) => typeof v === "number"
	) as ItemType[];
	const unacquiredItemsByType = types.map((type) =>
		unacquiredItems.filter((item) => ItemType[item.type] === type)
	);

	async function handleAddItem(item: ItemData) {
		const body = {
			itemId: item.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/items`),
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
		setCharacterItems((state) => {
			const newItem: CharacterItemStackExpanded = {
				id: Guid.Empty,
				characterId: characterId,
				itemId: item.id,
				item: item,
				amount: 1,
				type: "Character",
			};
			const compareFunction = (
				cs1: CharacterItemStackExpanded,
				cs2: CharacterItemStackExpanded
			) => {
				const typeOrder = ItemType[cs1.item.type] - ItemType[cs2.item.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.item.name.localeCompare(cs2.item.name);
			};
			return insertSorted(state, newItem, compareFunction);
		});
	}

	return (
		<>
			{unacquiredItemsByType.map((unacquiredItemsFromThisType, index) => {
				if (unacquiredItemsFromThisType.length === 0) return null;
				return (
					<UIBasics.ToggleHeader
						key={unacquiredItemsFromThisType[0].type}
						memoryId={`${characterId}-AddItem-Type-${unacquiredItemsFromThisType[0].type}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="blue"
						title={
							ItemTypePluralName[ItemType[index] as keyof typeof ItemType]
						}>
						<UIBasics.List.Grid
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredItemsFromThisType.map((item) => {
								return (
									<Dialog.Close
										key={item.id}
										asChild>
										<StyledLinklikeButton
											title={item.name}
											icon={item.iconUrl}
											onClick={() => handleAddItem(item)}
										/>
									</Dialog.Close>
								);
							})}
						/>
					</UIBasics.ToggleHeader>
				);
			})}
		</>
	);
}
