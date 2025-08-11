import { CharacterMiscMetrics, Guid, MagicAttribute } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useMemo } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { UIBasics } from "@/components/(UIBasics)";

interface AttributeSelectionCoreProps {
	characterId: Guid;
	alreadyHasAttributes: (keyof typeof MagicAttribute)[];
	miscMetrics: CharacterMiscMetrics;
	setMiscMetrics: Dispatch<SetStateAction<CharacterMiscMetrics>>;
}
export function AttributeSelectionCore({
	characterId,
	alreadyHasAttributes,
	miscMetrics,
	setMiscMetrics,
}: AttributeSelectionCoreProps) {
	const allMagicAttributeKeys = Object.keys(MagicAttribute).filter((key) =>
		isNaN(Number(key))
	) as (keyof typeof MagicAttribute)[];
	const unacquiredAttributes: (keyof typeof MagicAttribute)[] =
		allMagicAttributeKeys
			.filter(
				(attribute) =>
					!alreadyHasAttributes.includes(attribute) &&
					attribute != "Unknown" &&
					attribute != "Elemental" &&
					attribute != "Mundane"
			)
			.sort((a1, a2) => a1.localeCompare(a2));

	async function handleAddAttribute(attribute: keyof typeof MagicAttribute) {
		const body = {
			...miscMetrics,
			magicAttributes: [...miscMetrics.magicAttributes, attribute],
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/misc-metrics`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setMiscMetrics(body);
	}

	if (unacquiredAttributes.length === 0) {
		return (
			<UIBasics.Header
				textColor="gray"
				textAlign="center">
				Não há atributos disponíveis.
			</UIBasics.Header>
		);
	}
	return (
		<UIBasics.List.Grid
			columnWidth={300}
			direction="column"
			backgroundColor="gray"
			children={unacquiredAttributes.map((unacquiredAttribute) => {
				return (
					<Dialog.Close
						key={unacquiredAttribute}
						asChild>
						<StyledLinklikeButton
							title={unacquiredAttribute}
							onClick={() => handleAddAttribute(unacquiredAttribute)}
						/>
					</Dialog.Close>
				);
			})}
		/>
	);
}
