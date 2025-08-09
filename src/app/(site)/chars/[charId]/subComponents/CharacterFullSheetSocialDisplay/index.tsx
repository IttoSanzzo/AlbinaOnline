import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
import {
	CharacterEquipments,
	CharacterExpandedData,
	CharacterItemStackExpanded,
	CharacterMasteryExpanded,
	Guid,
} from "@/libs/stp@types";
import { CharacterDrawers } from "./subComponents/Drawers";
import { CharacterHeader } from "./subComponents/CharacterHeader";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

const fetchCharacter = {
	items: async (
		characterId: Guid,
		setCharacterItems: Dispatch<SetStateAction<CharacterItemStackExpanded[]>>
	) => {
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/items`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) throw new Error("Failed to fetch items");
		response.json().then((data: CharacterItemStackExpanded[]) => {
			const orderedData = data.sort((a, b) => {
				const nameCompare = a.item.name.localeCompare(b.item.name);
				if (nameCompare !== 0) return nameCompare;
				return a.amount - b.amount;
			});
			setCharacterItems(orderedData);
		});
	},
	masteries: async (
		characterId: Guid,
		setCharacterMasteries: Dispatch<SetStateAction<CharacterMasteryExpanded[]>>
	) => {
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/masteries`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) throw new Error("Failed to fetch masteries");
		response.json().then((data: CharacterMasteryExpanded[]) => {
			const orderedData = data.sort((a, b) => {
				const nameCompare = a.mastery.name.localeCompare(b.mastery.name);
				if (nameCompare !== 0) return nameCompare;
				return a.level - b.level;
			});
			setCharacterMasteries(orderedData);
		});
	},
	equipments: async (
		characterId: Guid,
		setCharacterEquipments: Dispatch<SetStateAction<CharacterEquipments | null>>
	) => {
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/equipments`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) throw new Error("Failed to fetch masteries");
		setCharacterEquipments(await response.json());
	},
};

interface CharacterFullSheetSocialDisplay {
	characterData: CharacterExpandedData;
}
export function CharacterFullSheetSocialDisplay({
	characterData,
}: CharacterFullSheetSocialDisplay) {
	const characterId = characterData.id;
	const [characterMasteriesState, setCharacterMasteriesState] = useState<
		CharacterMasteryExpanded[]
	>([]);
	const [characterItemsState, setCharacterItemsState] = useState<
		CharacterItemStackExpanded[]
	>([]);
	const [characterEquipmentsState, setCharacterEquipmentState] =
		useState<CharacterEquipments | null>(null);

	useLayoutEffect(() => {
		fetchCharacter.masteries(characterId, setCharacterMasteriesState);
		fetchCharacter.items(characterId, setCharacterItemsState);
		fetchCharacter.equipments(characterId, setCharacterEquipmentState);
	}, [characterId]);

	if (characterEquipmentsState === null) return null;

	return (
		<>
			<CharacterHeader
				level={characterData.level}
				race={characterData.race}
				characterItems={characterItemsState}
				coreMetrics={characterData.coreMetrics}
				miscMetrics={characterData.miscMetrics}
			/>
			<NotionBox
				backgroundColor="gray"
				withoutBorder>
				<CharacterDrawers.Inventory
					characterId={characterData.id}
					characterCoinStacks={characterData.coinStacks}
					characterItems={characterItemsState}
					characterEquipments={characterEquipmentsState}
				/>
				<CharacterDrawers.Statistics
					characterId={characterData.id}
					actionsPool={characterData.actionPool}
					coreMetrics={characterData.coreMetrics}
					miscMetrics={characterData.miscMetrics}
				/>
				<Notion2Columns
					withoutPadding
					withoutGap
					withoutBorderRadius
					colum1={<CharacterDrawers.Skills characterId={characterData.id} />}
					colum2={<CharacterDrawers.Spells characterId={characterData.id} />}
				/>
				<CharacterDrawers.ParametersAndAtributeScores
					characterId={characterData.id}
					parameters={characterData.parameters}
					abilityScore={characterData.abilityScore}
					race={characterData.race}
				/>
				<CharacterDrawers.MasteriesAndTests
					characterId={characterData.id}
					characterMasteries={characterMasteriesState}
					abilityScore={characterData.abilityScore}
				/>
				<CharacterDrawers.SpellDomains
					characterId={characterData.id}
					spellDomains={characterData.spellDomains}
				/>
				<CharacterDrawers.Others
					characterId={characterData.id}
					characterProfile={characterData.profile}
					characterBackstory={characterData.backstory.history}
				/>
			</NotionBox>
		</>
	);
}
