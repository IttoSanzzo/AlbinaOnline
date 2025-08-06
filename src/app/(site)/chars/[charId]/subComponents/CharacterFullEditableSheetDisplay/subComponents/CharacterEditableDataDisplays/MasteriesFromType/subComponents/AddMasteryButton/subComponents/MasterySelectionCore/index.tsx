import {
	CharacterMasteryExpanded,
	Guid,
	MasteryData,
	MasterySubType,
	MasteryType,
} from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";
import { useContext, useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { MasteriesContext } from "../../../../../../CharacterEditableSheetContextProviders";

interface MasterySelectionCoreProps {
	type: keyof typeof MasteryType;
	characterId: Guid;
	characterMasteries: CharacterMasteryExpanded[];
}
export function MasterySelectionCore({
	type,
	characterId,
	characterMasteries,
}: MasterySelectionCoreProps) {
	const [allMasteries, setAllMasteries] = useState<MasteryData[]>([]);
	const { setCharacterMasteries } = useContext(MasteriesContext);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/masteries?type=${type}`), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllMasteries(
				((await response.json()) as MasteryData[]).sort(
					(mastery1, mastery2) => {
						const typeOrder =
							MasterySubType[mastery1.subType] -
							MasterySubType[mastery2.subType];
						if (typeOrder !== 0) return typeOrder;
						return mastery1.name.localeCompare(mastery2.name);
					}
				)
			);
		});
	}, []);

	if (allMasteries.length == 0) return null;
	const unacquiredMasteries: MasteryData[] = allMasteries.filter(
		(mastery) =>
			!characterMasteries.some(
				(characterMastery) => characterMastery.masteryId == mastery.id
			)
	);

	async function handleAddMastery(mastery: MasteryData) {
		const body = {
			masteryId: mastery.id,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/masteries`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setCharacterMasteries((state) => {
			return [
				...state,
				{
					characterId,
					masteryId: mastery.id,
					id: Guid.Empty,
					level: 0,
					mastery: mastery,
				},
			];
		});
	}

	return (
		<NotionGridList
			columnWidth={300}
			direction="column"
			backgroundColor="gray"
			children={unacquiredMasteries.map((mastery) => {
				return (
					<Dialog.Close
						key={mastery.id}
						asChild>
						<StyledLinklikeButton
							title={mastery.name}
							icon={mastery.iconUrl}
							onClick={() => handleAddMastery(mastery)}
						/>
					</Dialog.Close>
				);
			})}
		/>
	);
}
