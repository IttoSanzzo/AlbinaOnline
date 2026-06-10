import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterTraitExpanded, Guid, TraitType } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import React, { useLayoutEffect, useState } from "react";
import { AddTraitButton } from "./subComponents/AddTraitButton";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";
import { useCharacterUpdated } from "@/libs/stp@hooks";
import { EditTraitNotesButton } from "./subComponents/EditTraitNotesButton";

async function handleTraitRemoval(
	characterId: Guid,
	traitId: Guid,
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>,
) {
	const body = { traitId: traitId };
	const toastId = toast.loading(CharToastMessage.loading);
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress(`/chars/${characterId}/traits`),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	if (!response.ok) {
		toast.error(CharToastMessage.error, { id: toastId });
		return;
	}
	toast.success(CharToastMessage.success, { id: toastId });
	setCharacterTraits((state) =>
		state.filter((trait) => trait.trait.id != traitId),
	);
}

function formTable(
	characterId: Guid,
	characterTraits: CharacterTraitExpanded[],
	setCharacterTraits: React.Dispatch<
		React.SetStateAction<CharacterTraitExpanded[]>
	>,
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
			characterTrait.notes.length > 0 ? (
				<UIBasics.Toggle
					floatingReverseButton
					withoutPadding
					contentMargin="none"
					textColor="gray"
					memoryId={`${characterTrait.characterId}-traits-${characterTrait.traitId}-notes`}
					title={
						<StyledLinkWithButton
							buttonIcon={{ name: "TrashIcon", color: "red" }}
							title={characterTrait.trait.name}
							icon={characterTrait.trait.iconUrl}
							href={`/traits/${characterTrait.trait.slug}`}
							style={{ width: "100%" }}
							onClick={() =>
								handleTraitRemoval(
									characterId,
									characterTrait.trait.id,
									setCharacterTraits,
								)
							}>
							<EditTraitNotesButton
								style={{ right: "30px" }}
								characterId={characterId}
								skillId={characterTrait.traitId}
								notes={characterTrait.notes}
							/>
						</StyledLinkWithButton>
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
						{characterTrait.notes}
					</p>
				</UIBasics.Toggle>
			) : (
				<StyledLinkWithButton
					buttonIcon={{ name: "TrashIcon", color: "red" }}
					title={characterTrait.trait.name}
					icon={characterTrait.trait.iconUrl}
					href={`/traits/${characterTrait.trait.slug}`}
					onClick={() =>
						handleTraitRemoval(
							characterId,
							characterTrait.trait.id,
							setCharacterTraits,
						)
					}>
					<EditTraitNotesButton
						characterId={characterId}
						skillId={characterTrait.traitId}
						notes={characterTrait.notes}
					/>
				</StyledLinkWithButton>
			),
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

	async function loadTraitsAsync(): Promise<boolean> {
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
		loadTraitsAsync();
	}, []);

	useCharacterUpdated(characterId, async () => {
		return await loadTraitsAsync();
	});

	return (
		<div style={{ position: "relative" }}>
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
					tableLanes: formTable(
						characterId,
						characterTraits,
						setCharacterTraits,
					),
				}}
			/>
			<AddTraitButton
				characterTraits={characterTraits}
				setCharacterTraits={setCharacterTraits}
				characterId={characterId}
			/>
		</div>
	);
}

function areEqual(
	prevProps: CharacterTraitsDisplayProps,
	nextProps: CharacterTraitsDisplayProps,
) {
	return prevProps.characterId === nextProps.characterId;
}
export const CharacterTraitsDisplay = React.memo(
	_CharacterTraitsDisplay,
	areEqual,
);
