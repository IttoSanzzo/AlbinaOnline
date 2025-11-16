import { StyledLinklikeButton } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { ArraySearchFilter } from "@/components/(UTILS)";
import {
	CharacterTraitExpanded,
	Guid,
	TraitData,
	traitNames,
	TraitType,
} from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { insertSorted } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useLayoutEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";

interface TraitSelectionCoreProps {
	characterId: Guid;
	characterTraits: CharacterTraitExpanded[];
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	isInBulkMode: boolean;
}
export function TraitSelectionCore({
	characterId,
	characterTraits,
	setCharacterTraits,
	isInBulkMode,
	setOpenState,
}: TraitSelectionCoreProps) {
	const [allTraits, setAllTraits] = useState<TraitData[]>([]);
	const [selectionPool, setSelectionPool] = useState<TraitData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiFullAddress("/traits"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllTraits(await response.json());
		});
	}, []);

	const unacquiredTraits: TraitData[] = useMemo(
		() =>
			allTraits
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
				}),
		[allTraits, characterTraits]
	);
	if (allTraits.length == 0) return null;

	const unacquiredTraitsByType = Array.from({ length: 5 }, (_, index) =>
		selectionPool.filter((trait) => TraitType[trait.type] === index)
	);

	async function handleAddTrait(trait: TraitData) {
		if (isInBulkMode === false) setOpenState(false);
		const body = {
			traitId: trait.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/traits`),
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
			<ArraySearchFilter
				array={unacquiredTraits}
				setFilteredState={setSelectionPool}
				label="Filtro"
				placeholder="Nome..."
				stringKeysToCheck={["name", "slug"]}
			/>
			{unacquiredTraitsByType.map((unacquiredTraitFromThisType, index) => {
				if (unacquiredTraitFromThisType.length === 0) return null;
				return (
					<UIBasics.ToggleHeader
						defaultOpenState={true}
						key={index}
						memoryId={`${characterId}-AddTrait-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="blue"
						title={traitNames[TraitType[index] as keyof typeof TraitType]}>
						<UIBasics.List.Grid
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredTraitFromThisType.map((trait) => {
								return (
									<StyledLinklikeButton
										key={trait.id}
										title={trait.name}
										icon={trait.iconUrl}
										onClick={() => handleAddTrait(trait)}
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
