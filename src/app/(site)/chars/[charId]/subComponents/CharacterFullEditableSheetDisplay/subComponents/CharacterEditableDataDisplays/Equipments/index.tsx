import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { useContext, useLayoutEffect } from "react";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { CharacterItemStackExpanded, Guid } from "@/libs/stp@types";
import React from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { ItemsContext } from "../../CharacterEditableSheetContextProviders/contexts/Items";

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

export function _CharacterEquipmentsDisplay() {
	// const { characterItems, setCharacterItems } = useContext(ItemsContext);
	const { characterId } = useContext(CharacterIdContext);

	// useLayoutEffect(() => {
	// 	authenticatedFetchAsync(
	// 		getAlbinaApiAddress(`/chars/${characterId}/equipments`),
	// 		{
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		}
	// 	).then((response) => {
	// 		if (!response.ok) throw new Error("Failed to fetch masteries");
	// 		response.json().then((data: CharacterItemStackExpanded[]) => {
	// 			const orderedData = data.sort((a, b) => {
	// 				const nameCompare = a.item.name.localeCompare(b.item.name);
	// 				if (nameCompare !== 0) return nameCompare;
	// 				return a.amount - b.amount;
	// 			});
	// 			// setCharacterItems(orderedData);
	// 		});
	// 	});
	// }, [characterId]);

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
						tableData={{
							tableLanes: [
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Frame"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Mão Principal"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Mão Secundária"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Cabeça"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Pés"
									/>,
									...[],
								],
							],
						}}
					/>
				}
				colum2={
					<NotionTable
						fixedLinePositions={[1]}
						fixedLineWidths={[20]}
						tableData={{
							tableLanes: [
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Corpo"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Braços"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Rosto"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Cinto"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Brinco"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Colar"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Pulseira"
									/>,
									...[],
								],
								[
									<NotionText
										display="block"
										textAlign="center"
										children="Anel"
									/>,
									...[],
								],
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
