import { StyledLink, StyledLinkWithButton } from "@/components/(Design)";
import {
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterTraitExpanded, Guid, TraitType } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterTraits: CharacterTraitExpanded[]
): React.JSX.Element[][] {
	const titleRow = [
		<NotionText
			textColor="gray"
			children="Nome"
		/>,
	];
	if (characterTraits.length == 0) {
		return [
			titleRow,
			[
				<NotionText
					textColor="orange"
					children="-"
				/>,
			],
		];
	}
	return [
		titleRow,
		...characterTraits.map((characterTrait) => [
			<StyledLink
				title={characterTrait.trait.name}
				icon={characterTrait.trait.iconUrl}
				href={`/traits/${characterTrait.trait.slug}`}
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
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Traços"
			memoryId={`${characterId}-Traits`}>
			<NotionTable
				style={{ margin: 0 }}
				withHeaderColumn={false}
				columnBackgroundColors={["gray"]}
				withHeaderRow
				tableData={{
					tableLanes: formTable(characterTraits),
				}}
			/>
		</NotionToggleHeader>
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
