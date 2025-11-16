import { StyledLinklikeButton } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import {
	CharacterItemStackExpanded,
	Guid,
	ItemData,
	ItemType,
	ItemTypePluralName,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { insertSorted } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";
import { ArraySearchFilter } from "@/components/(UTILS)";

const types = Object.values(ItemType).filter(
	(v) => typeof v === "number"
) as ItemType[];

interface ItemSelectionCoreProps {
	characterId: Guid;
	characterItems: CharacterItemStackExpanded[];
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	isInBulkMode: boolean;
}
export function ItemSelectionCore({
	characterId,
	characterItems,
	setCharacterItems,
	isInBulkMode,
	setOpenState,
}: ItemSelectionCoreProps) {
	const [allItems, setAllItems] = useState<ItemData[]>([]);
	const [selectionPool, setSelectionPool] = useState<ItemData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiFullAddress("/items"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllItems(await response.json());
		});
	}, []);

	const unacquiredItems: ItemData[] = useMemo(
		() =>
			allItems
				.filter(
					(item) =>
						!characterItems.some(
							(characterItem) => characterItem.itemId == item.id
						)
				)
				.sort((item1, item2) => item1.name.localeCompare(item2.name)),
		[allItems, characterItems]
	);
	if (allItems.length == 0) return null;

	const unacquiredItemsByType = types.map((type) =>
		selectionPool.filter((item) => ItemType[item.type] === type)
	);

	async function handleAddItem(item: ItemData) {
		if (isInBulkMode == false) setOpenState(false);
		const body = {
			itemId: item.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/items`),
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
			<ArraySearchFilter
				array={unacquiredItems}
				setFilteredState={setSelectionPool}
				label="Filtro"
				placeholder="Nome..."
				stringKeysToCheck={["name", "slug"]}
			/>
			{unacquiredItemsByType.map((unacquiredItemsFromThisType, index) => {
				if (unacquiredItemsFromThisType.length === 0) return null;
				return (
					<UIBasics.ToggleHeader
						defaultOpenState={true}
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
									<StyledLinklikeButton
										key={item.id}
										title={item.name}
										icon={item.iconUrl}
										onClick={() => handleAddItem(item)}
									/>
								);
							})}
						/>
					</UIBasics.ToggleHeader>
				);
			})}
		</>
	);
}
