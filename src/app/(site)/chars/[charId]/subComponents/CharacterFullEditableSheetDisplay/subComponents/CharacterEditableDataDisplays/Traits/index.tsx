import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterTraitExpanded, Guid, TraitType } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";
import { AddTraitButton } from "./subComponents/AddTraitButton";
import { UIBasics } from "@/components/(UIBasics)";

async function handleTraitRemoval(
	characterId: Guid,
	traitId: Guid,
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>
) {
	const body = { traitId: traitId };
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(`/chars/${characterId}/traits`),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (!response.ok) return;
	setCharacterTraits((state) =>
		state.filter((trait) => trait.trait.id != traitId)
	);
}

function formTable(
	characterId: Guid,
	characterTraits: CharacterTraitExpanded[],
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Nome"
		/>,
	];
	if (characterTraits.length == 0) {
		return [
			titleRow,
			[
				<UIBasics.Text
					textColor="orange"
					children="-"
				/>,
			],
		];
	}
	return [
		titleRow,
		...characterTraits.map((characterTrait) => [
			<StyledLinkWithButton
				buttonIcon={{ name: "TrashIcon", color: "red" }}
				title={characterTrait.trait.name}
				icon={characterTrait.trait.iconUrl}
				href={`/traits/${characterTrait.trait.slug}`}
				onClick={() =>
					handleTraitRemoval(
						characterId,
						characterTrait.trait.id,
						setCharacterTraits
					)
				}
			/>,
		]),
	];
}

interface CharacterTraitsDisplayProps {
	characterId: Guid;
}
export function _CharacterTraitsDisplay({
	characterId,
}: CharacterTraitsDisplayProps) {
	const [characterTraits, setCharacterTraits] = useState<
		CharacterTraitExpanded[]
	>([]);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/traits`),
			{
				method: "GET",
			}
		).then(async (response) => {
			if (!response.ok) return;
			const sortedTraits: CharacterTraitExpanded[] = (
				(await response.json()) as CharacterTraitExpanded[]
			).sort((cs1, cs2) => {
				const typeOrder = TraitType[cs1.trait.type] - TraitType[cs2.trait.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.trait.name.localeCompare(cs2.trait.name);
			});
			setCharacterTraits(sortedTraits);
		});
	}, []);

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Traços"
			memoryId={`${characterId}-Traits`}>
			<div style={{ position: "relative" }}>
				<UIBasics.Table
					style={{ margin: 0 }}
					withHeaderColumn={false}
					columnBackgroundColors={["gray"]}
					withHeaderRow
					tableData={{
						tableLanes: formTable(
							characterId,
							characterTraits,
							setCharacterTraits
						),
					}}
				/>
				<AddTraitButton
					characterTraits={characterTraits}
					setCharacterTraits={setCharacterTraits}
					characterId={characterId}
				/>
			</div>
		</UIBasics.ToggleHeader>
	);
}

function areEqual(
	prevProps: CharacterTraitsDisplayProps,
	nextProps: CharacterTraitsDisplayProps
) {
	return prevProps.characterId === nextProps.characterId;
}
export const CharacterTraitsDisplay = React.memo(
	_CharacterTraitsDisplay,
	areEqual
);
