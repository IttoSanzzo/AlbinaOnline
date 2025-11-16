import { Guid, ItemData } from "@/libs/stp@types";
import React, { useLayoutEffect, useState } from "react";
import { StyledLink } from "@/components/(Design)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

interface EquipedItemDisplayProps {
	itemId: Guid;
}
function _EquipedItemDisplay({ itemId }: EquipedItemDisplayProps) {
	const [itemData, setItemData] = useState<ItemData | null>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiFullAddress(`/items?id=${itemId}`), {
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
		<StyledLink
			title={itemData.name}
			href={`/items/${itemData.slug}`}
			icon={itemData.iconUrl}
		/>
	);
}

const areEqual = (
	prevProps: EquipedItemDisplayProps,
	nextProps: EquipedItemDisplayProps
) => prevProps.itemId === nextProps.itemId;
export const EquipedItemDisplay = React.memo(_EquipedItemDisplay, areEqual);
