import { useContext, useLayoutEffect } from "react";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import {
	CharacterEquipments,
	CharacterItemStackExpanded,
	Guid,
} from "@/libs/stp@types";
import React from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { StyledLinkWithButton } from "@/components/(Design)";
import { ItemsContext } from "../../CharacterEditableSheetContextProviders/contexts/Items";
import { AddItemButton } from "./subComponents/AddItemButton";
import { ItemAmountController } from "./subComponents/ItemAmountController";
import { EquipmentsContext } from "../../CharacterEditableSheetContextProviders/contexts/Equipments";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

async function handleItemRemoval(
	characterId: Guid,
	itemId: Guid,
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>,
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>
) {
	const body = { itemId: itemId };
	const toastId = toast.loading(CharToastMessage.loading);
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
	if (!response.ok) {
		toast.error(CharToastMessage.error, { id: toastId });
		return;
	}
	toast.success(CharToastMessage.success, { id: toastId });
	setCharacterItems((state) => state.filter((item) => item.item.id != itemId));
	setCharacterEquipments((state) => ({
		...state,
		slots: Object.fromEntries(
			Object.entries(state.slots).map(([slot, ids]) => [
				slot,
				ids.filter((id) => id !== itemId),
			])
		),
	}));
}
function calcTotalWeight(characterItems: CharacterItemStackExpanded[]) {
	return (
		characterItems.reduce(
			(acc, current) => acc + current.amount * current.item.properties.weight,
			0
		) / 1000
	);
}

function formTable(
	characterId: Guid,
	characterItems: CharacterItemStackExpanded[],
	setCharacterItems: React.Dispatch<
		React.SetStateAction<CharacterItemStackExpanded[]>
	>,
	setCharacterEquipments: React.Dispatch<
		React.SetStateAction<CharacterEquipments>
	>
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Nome"
		/>,
		<UIBasics.Text
			textColor="gray"
			textAlign="center"
			display="block"
			children="Quant."
		/>,
		<UIBasics.Text
			textColor="gray"
			textAlign="center"
			display="block"
			children="- Kg"
		/>,
	];
	if (characterItems.length == 0) {
		return [
			titleRow,
			[
				<UIBasics.Text
					textColor="orange"
					children="-"
				/>,
				<UIBasics.Text
					textColor="orange"
					textAlign="center"
					display="block"
					children="-"
				/>,
				<UIBasics.Text
					textColor="orange"
					textAlign="center"
					display="block"
					children="-"
				/>,
			],
		];
	}
	return [
		[
			<UIBasics.Text
				textColor="gray"
				children="Nome"
			/>,
			<UIBasics.Text
				textColor="gray"
				textAlign="center"
				display="block"
				children="Quant."
			/>,
			<UIBasics.Text
				textColor="gray"
				textAlign="center"
				display="block"
				children={`${calcTotalWeight(characterItems)} Kg`}
			/>,
		],
		...characterItems.map((characterItem) => [
			<StyledLinkWithButton
				buttonIcon={{ name: "TrashIcon", color: "red" }}
				title={characterItem.item.name}
				icon={characterItem.item.iconUrl}
				href={`/items/${characterItem.item.slug}`}
				onClick={() =>
					handleItemRemoval(
						characterId,
						characterItem.item.id,
						setCharacterItems,
						setCharacterEquipments
					)
				}
			/>,
			<ItemAmountController
				amount={characterItem.amount}
				itemId={characterItem.item.id}
				characterId={characterId}
			/>,
			<UIBasics.Text
				textAlign="center"
				display="block"
				textColor="gray"
				children={`${
					(characterItem.amount * characterItem.item.properties.weight) / 1000
				}`}
			/>,
		]),
	];
}

export function _CharacterItemStacksDisplay() {
	const { characterItems, setCharacterItems } = useContext(ItemsContext);
	const { setCharacterEquipments } = useContext(EquipmentsContext);
	const { characterId } = useContext(CharacterIdContext);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/items`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then((response) => {
			if (!response.ok) throw new Error("Failed to fetch masteries");
			response.json().then((data: CharacterItemStackExpanded[]) => {
				const orderedData = data.sort((a, b) => {
					const nameCompare = a.item.name.localeCompare(b.item.name);
					if (nameCompare !== 0) return nameCompare;
					return a.amount - b.amount;
				});
				setCharacterItems(orderedData);
			});
		});
	}, [characterId]);

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Items"
			memoryId={`${characterId}-Items`}>
			<div style={{ position: "relative" }}>
				<UIBasics.Table
					fixedLineWidths={[30, 20]}
					fixedLinePositions={[2, 3]}
					style={{ margin: 0 }}
					withHeaderColumn={false}
					columnBackgroundColors={["gray"]}
					withHeaderRow
					tableData={{
						tableLanes: formTable(
							characterId,
							characterItems,
							setCharacterItems,
							setCharacterEquipments
						),
					}}
				/>
				<AddItemButton
					characterItems={characterItems}
					setCharacterItems={setCharacterItems}
					characterId={characterId}
				/>
			</div>
		</UIBasics.ToggleHeader>
	);
}

export const CharacterItemStacksDisplay = React.memo(
	_CharacterItemStacksDisplay
);
