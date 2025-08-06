import {
	CharacterTraitExpanded,
	Guid,
	TraitData,
	traitNames,
	TraitType,
} from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";
import { useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { NotionToggleHeader } from "@/components/(NotionBased)";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface TraitSelectionCoreProps {
	characterId: Guid;
	characterTraits: CharacterTraitExpanded[];
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>;
}
export function TraitSelectionCore({
	characterId,
	characterTraits,
	setCharacterTraits,
}: TraitSelectionCoreProps) {
	const [allTraits, setAllTraits] = useState<TraitData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/traits"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllTraits(await response.json());
		});
	}, []);

	if (allTraits.length == 0) return null;
	const unacquiredTraits: TraitData[] = allTraits
		.filter(
			(trait) =>
				!characterTraits.some(
					(characterTrait) => characterTrait.traitId == trait.id
				)
		)
		.sort((trait1, trait2) => {
			const typeOrder = TraitType[trait1.type] - TraitType[trait2.type];
			if (typeOrder !== 0) return typeOrder;
			return trait1.name.localeCompare(trait2.name);
		});
	const unacquiredTraitsByType = Array.from({ length: 5 }, (_, index) =>
		unacquiredTraits.filter((trait) => TraitType[trait.type] === index)
	);

	async function handleAddTrait(trait: TraitData) {
		const body = {
			traitId: trait.id,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/traits`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setCharacterTraits((state) => {
			const newTrait: CharacterTraitExpanded = {
				id: Guid.Empty,
				characterId: characterId,
				traitId: trait.id,
				trait: trait,
			};
			const compareFunction = (
				cs1: CharacterTraitExpanded,
				cs2: CharacterTraitExpanded
			) => {
				const typeOrder = TraitType[cs1.trait.type] - TraitType[cs2.trait.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.trait.name.localeCompare(cs2.trait.name);
			};
			return insertSorted(state, newTrait, compareFunction);
		});
	}

	return (
		<>
			{unacquiredTraitsByType.map((unacquiredTraitFromThisType, index) => {
				if (unacquiredTraitFromThisType.length === 0) return null;
				return (
					<NotionToggleHeader
						key={index}
						memoryId={`${characterId}-AddTrait-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="blue"
						title={traitNames[TraitType[index] as keyof typeof TraitType]}>
						<NotionGridList
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredTraitFromThisType.map((trait) => {
								return (
									<Dialog.Close
										key={trait.id}
										asChild>
										<StyledLinklikeButton
											title={trait.name}
											icon={trait.iconUrl}
											onClick={() => handleAddTrait(trait)}
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
