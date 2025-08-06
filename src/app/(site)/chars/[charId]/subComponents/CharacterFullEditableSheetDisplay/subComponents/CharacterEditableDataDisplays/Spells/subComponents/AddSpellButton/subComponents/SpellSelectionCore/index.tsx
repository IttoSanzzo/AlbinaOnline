import {
	CharacterSpellExpanded,
	Guid,
	SpellData,
	SpellType,
} from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";
import { useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { NotionHeader, NotionToggleHeader } from "@/components/(NotionBased)";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface SpellSelectionCoreProps {
	characterId: Guid;
	characterSpells: CharacterSpellExpanded[];
	setCharacterSpells: React.Dispatch<
		React.SetStateAction<CharacterSpellExpanded[]>
	>;
}
export function SpellSelectionCore({
	characterId,
	characterSpells,
	setCharacterSpells,
}: SpellSelectionCoreProps) {
	const [allSpells, setAllSpells] = useState<SpellData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/spells"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllSpells(await response.json());
		});
	}, []);

	if (allSpells.length == 0) return null;
	const unacquiredSpells: SpellData[] = allSpells
		.filter(
			(spell) =>
				!characterSpells.some(
					(characterSpell) => characterSpell.spellId == spell.id
				)
		)
		.sort((spell1, spell2) => {
			const levelOrder = spell1.domainLevel - spell2.domainLevel;
			if (levelOrder !== 0) return levelOrder;
			return spell1.name.localeCompare(spell2.name);
		});
	const unacquiredSpellsByLevel = Array.from({ length: 13 }, (_, index) =>
		unacquiredSpells.filter((spell) => spell.domainLevel === index)
	);

	async function handleAddSpell(spell: SpellData) {
		const body = {
			spellId: spell.id,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/spells`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setCharacterSpells((state) => {
			const newSpell: CharacterSpellExpanded = {
				id: Guid.Empty,
				characterId: characterId,
				spellId: spell.id,
				spell: spell,
			};
			const compareFunction = (
				cs1: CharacterSpellExpanded,
				cs2: CharacterSpellExpanded
			) => {
				const typeOrder = SpellType[cs1.spell.type] - SpellType[cs2.spell.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.spell.name.localeCompare(cs2.spell.name);
			};
			return insertSorted(state, newSpell, compareFunction);
		});
	}

	return (
		<>
			{unacquiredSpellsByLevel.map((unacquiredSpellFromThisLevel, index) => {
				if (unacquiredSpellFromThisLevel.length === 0) return null;
				return (
					<NotionToggleHeader
						key={index}
						memoryId={`${characterId}-AddSpell-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="purple"
						title={`Nível ${index}`}>
						<NotionGridList
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredSpellFromThisLevel.map((spell) => {
								return (
									<Dialog.Close
										key={spell.id}
										asChild>
										<StyledLinklikeButton
											title={spell.name}
											icon={spell.iconUrl}
											onClick={() => handleAddSpell(spell)}
										/>
									</Dialog.Close>
								);
							})}
						/>
					</NotionToggleHeader>
				);
			})}
		</>
	);
}
