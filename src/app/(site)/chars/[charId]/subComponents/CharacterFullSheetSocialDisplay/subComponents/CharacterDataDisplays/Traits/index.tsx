import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { useCharacterUpdated } from "@/libs/stp@hooks";
import { CharacterTraitExpanded, Guid, TraitType } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterTraits: CharacterTraitExpanded[],
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Traços"
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

	async function loadCharacterTraits(): Promise<boolean> {
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/traits`),
			{
				method: "GET",
			},
		);
		if (!response.ok) return false;
		const sortedTraits: CharacterTraitExpanded[] = (
			(await response.json()) as CharacterTraitExpanded[]
		).sort((cs1, cs2) => {
			const typeOrder = TraitType[cs1.trait.type] - TraitType[cs2.trait.type];
			if (typeOrder !== 0) return typeOrder;
			return cs1.trait.name.localeCompare(cs2.trait.name);
		});
		setCharacterTraits(sortedTraits);
		return true;
	}

	useLayoutEffect(() => {
		loadCharacterTraits();
	}, []);

	useCharacterUpdated(characterId, async () => {
		return await loadCharacterTraits();
	});

	return (
		<UIBasics.Table
			style={{
				marginLeft: "5px",
				marginBottom: 0,
				width: "calc(100% - 10px)",
			}}
			withHeaderColumn={false}
			columnBackgroundColors={["gray"]}
			withHeaderRow
			tableData={{
				tableLanes: formTable(characterTraits),
			}}
		/>
	);
}

export const CharacterTraitsDisplay = React.memo(_CharacterTraitsDisplay);
