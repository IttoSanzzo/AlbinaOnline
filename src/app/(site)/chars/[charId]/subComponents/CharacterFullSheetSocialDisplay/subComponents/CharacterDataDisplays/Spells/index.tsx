import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSpellExpanded, Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterSpells: CharacterSpellExpanded[]
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Nome"
		/>,
	];
	if (characterSpells.length == 0) {
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
	const levelsWithSpells = [
		...new Set(characterSpells.map((s) => s.spell.domainLevel)),
	].sort((a, b) => a - b);
	return [
		titleRow,
		...levelsWithSpells.flatMap((index) => {
			const spellsFromThisLevel = characterSpells.filter(
				(spell) => spell.spell.domainLevel === index
			);
			if (spellsFromThisLevel.length === 0) return [];
			return [
				[
					<UIBasics.Text
						textColor="orange"
						children={`Nível ${index}`}
					/>,
				],
				...characterSpells
					.filter((spell) => spell.spell.domainLevel === index)
					.map((characterSpell) => [
						<StyledLink
							title={characterSpell.spell.name}
							icon={characterSpell.spell.iconUrl}
							href={`/spells/${characterSpell.spell.slug}`}
						/>,
					]),
			];
		}),
	];
}

interface CharacterSpellsDisplayProps {
	characterId: Guid;
}
export function _CharacterSpellsDisplay({
	characterId,
}: CharacterSpellsDisplayProps) {
	const [characterSpells, setCharacterSpells] = useState<
		CharacterSpellExpanded[]
	>([]);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/spells`),
			{
				method: "GET",
			}
		).then(async (response) => {
			if (!response.ok) return;
			const sortedSpells: CharacterSpellExpanded[] = (
				(await response.json()) as CharacterSpellExpanded[]
			).sort((cs1, cs2) => {
				const levelOrder = cs1.spell.domainLevel - cs2.spell.domainLevel;
				if (levelOrder !== 0) return levelOrder;
				return cs1.spell.name.localeCompare(cs2.spell.name);
			});
			setCharacterSpells(sortedSpells);
		});
	}, []);

	return (
		<UIBasics.Table
			style={{ margin: 0 }}
			withHeaderColumn={false}
			columnBackgroundColors={["gray"]}
			withHeaderRow
			tableData={{
				tableLanes: formTable(characterSpells),
			}}
		/>
	);
}

function areEqual(
	prevProps: CharacterSpellsDisplayProps,
	nextProps: CharacterSpellsDisplayProps
) {
	return prevProps.characterId === nextProps.characterId;
}
export const CharacterSpellsDisplay = React.memo(
	_CharacterSpellsDisplay,
	areEqual
);
