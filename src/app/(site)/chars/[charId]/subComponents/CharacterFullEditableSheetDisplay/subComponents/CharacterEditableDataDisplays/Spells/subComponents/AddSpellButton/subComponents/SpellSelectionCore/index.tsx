import { StyledLinklikeButton } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { ArraySearchFilter } from "@/components/(UTILS)";
import {
	CharacterSpellExpanded,
	Guid,
	SpellData,
	SpellType,
} from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { insertSorted } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface SpellSelectionCoreProps {
	characterId: Guid;
	characterSpells: CharacterSpellExpanded[];
	setCharacterSpells: React.Dispatch<
		React.SetStateAction<CharacterSpellExpanded[]>
	>;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	isInBulkMode: boolean;
}
export function SpellSelectionCore({
	characterId,
	characterSpells,
	setCharacterSpells,
	isInBulkMode,
	setOpenState,
}: SpellSelectionCoreProps) {
	const [allSpells, setAllSpells] = useState<SpellData[]>([]);
	const [selectionPool, setSelectionPool] = useState<SpellData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/spells"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllSpells(await response.json());
		});
	}, []);

	const unacquiredSpells: SpellData[] = useMemo(
		() =>
			allSpells
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
				}),
		[allSpells, characterSpells]
	);
	if (allSpells.length == 0) return null;

	const unacquiredSpellsByLevel = Array.from({ length: 13 }, (_, index) =>
		selectionPool.filter((spell) => spell.domainLevel === index)
	);

	async function handleAddSpell(spell: SpellData) {
		if (isInBulkMode == false) setOpenState(false);
		const body = {
			spellId: spell.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
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
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
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
			<ArraySearchFilter
				array={unacquiredSpells}
				setFilteredState={setSelectionPool}
				label="Filtro"
				placeholder="Nome | Atributo | Domínio"
				stringKeysToCheck={["name", "slug"]}
				arrayKeysToCheck={["magicAttributes", "spellDomains"]}
			/>
			{unacquiredSpellsByLevel.map((unacquiredSpellFromThisLevel, index) => {
				if (unacquiredSpellFromThisLevel.length === 0) return null;
				return (
					<UIBasics.ToggleHeader
						defaultOpenState={true}
						key={index}
						memoryId={`${characterId}-AddSpell-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="purple"
						title={`Nível ${index}`}>
						<UIBasics.List.Grid
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredSpellFromThisLevel.map((spell) => {
								return (
									<StyledLinklikeButton
										key={spell.id}
										title={spell.name}
										icon={spell.iconUrl}
										onClick={() => handleAddSpell(spell)}
									/>
								);
							})}
						/>
					</UIBasics.ToggleHeader>
				);
			})}
		</>
	);
}
