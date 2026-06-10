import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSpellExpanded, Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterSpells: CharacterSpellExpanded[],
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Spells"
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
				(spell) => spell.spell.domainLevel === index,
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
						(characterSpell.notes ?? "").length > 0 ? (
							<UIBasics.Toggle
								floatingReverseButton
								withoutPadding
								contentMargin="none"
								textColor="gray"
								memoryId={`${characterSpell.characterId}-spells-${characterSpell.spellId}-notes`}
								title={
									<StyledLink
										title={characterSpell.spell.name}
										icon={characterSpell.spell.iconUrl}
										href={`/spells/${characterSpell.spell.slug}`}
										style={{ width: "100%" }}
									/>
								}>
								<p
									style={{
										border: "5px solid var(--cl-gray-800)",
										borderTop: 0,
										borderBottomLeftRadius: "var(--rd-md)",
										borderBottomRightRadius: "var(--rd-md)",
										padding: "var(--sp-1) var(--sp-3)",
										display: "block",
										whiteSpace: "pre-wrap",
									}}>
									{characterSpell.notes}
								</p>
							</UIBasics.Toggle>
						) : (
							<StyledLink
								title={characterSpell.spell.name}
								icon={characterSpell.spell.iconUrl}
								href={`/spells/${characterSpell.spell.slug}`}
							/>
						),
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
				next: { tags: [`/chars/${characterId}`] },
			},
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
		<div>
			<UIBasics.Table
				style={{ margin: 0 }}
				withHeaderColumn={false}
				columnBackgroundColors={["gray"]}
				withHeaderRow
				tableData={{
					tableLanes: formTable(characterSpells),
				}}
			/>
		</div>
	);
}

export const CharacterSpellsDisplay = React.memo(_CharacterSpellsDisplay);
