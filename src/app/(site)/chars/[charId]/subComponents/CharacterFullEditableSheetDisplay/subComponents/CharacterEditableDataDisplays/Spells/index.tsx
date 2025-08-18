import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterSpellExpanded, Guid } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";
import { AddSpellButton } from "./subComponents/AddSpellButton";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

async function handleSpellRemoval(
	characterId: Guid,
	spellId: Guid,
	setCharacterSpells: React.Dispatch<
		React.SetStateAction<CharacterSpellExpanded[]>
	>
) {
	const body = { spellId: spellId };
	const toastId = toast.loading(CharToastMessage.loading);
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(`/chars/${characterId}/spells`),
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
	setCharacterSpells((state) =>
		state.filter((spell) => spell.spell.id != spellId)
	);
}

function formTable(
	characterId: Guid,
	characterSpells: CharacterSpellExpanded[],
	setCharacterSpells: React.Dispatch<
		React.SetStateAction<CharacterSpellExpanded[]>
	>
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
						<StyledLinkWithButton
							buttonIcon={{ name: "TrashIcon", color: "red" }}
							title={characterSpell.spell.name}
							icon={characterSpell.spell.iconUrl}
							href={`/spells/${characterSpell.spell.slug}`}
							onClick={() =>
								handleSpellRemoval(
									characterId,
									characterSpell.spell.id,
									setCharacterSpells
								)
							}
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
			getAlbinaApiAddress(`/chars/${characterId}/spells`),
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
		<div style={{ position: "relative" }}>
			<UIBasics.Table
				style={{ margin: 0 }}
				withHeaderColumn={false}
				columnBackgroundColors={["gray"]}
				withHeaderRow
				tableData={{
					tableLanes: formTable(
						characterId,
						characterSpells,
						setCharacterSpells
					),
				}}
			/>
			<AddSpellButton
				characterSpells={characterSpells}
				setCharacterSpells={setCharacterSpells}
				characterId={characterId}
			/>
		</div>
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
