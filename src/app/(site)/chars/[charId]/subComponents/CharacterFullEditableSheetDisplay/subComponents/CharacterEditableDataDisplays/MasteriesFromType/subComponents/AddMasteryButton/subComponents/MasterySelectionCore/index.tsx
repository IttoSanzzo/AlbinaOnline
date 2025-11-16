import {
	CharacterMasteryExpanded,
	Guid,
	MasteryData,
	MasterySubType,
	MasteryType,
} from "@/libs/stp@types";
import { useContext, useLayoutEffect, useMemo, useState } from "react";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { MasteriesContext } from "../../../../../../CharacterEditableSheetContextProviders";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";
import { ArraySearchFilter } from "@/components/(UTILS)";

interface MasterySelectionCoreProps {
	type: keyof typeof MasteryType;
	characterId: Guid;
	characterMasteries: CharacterMasteryExpanded[];
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	isInBulkMode: boolean;
}
export function MasterySelectionCore({
	type,
	characterId,
	characterMasteries,
	isInBulkMode,
	setOpenState,
}: MasterySelectionCoreProps) {
	const [allMasteries, setAllMasteries] = useState<MasteryData[]>([]);
	const [selectionPool, setSelectionPool] = useState<MasteryData[]>([]);
	const { setCharacterMasteries } = useContext(MasteriesContext);

	useLayoutEffect(() => {
		fetch(getAlbinaApiFullAddress(`/masteries?type=${type}`), {
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

	const unacquiredMasteries: MasteryData[] = useMemo(
		() =>
			allMasteries.filter(
				(mastery) =>
					!characterMasteries.some(
						(characterMastery) => characterMastery.masteryId == mastery.id
					)
			),
		[allMasteries, characterMasteries]
	);
	if (allMasteries.length == 0) return null;

	async function handleAddMastery(mastery: MasteryData) {
		if (isInBulkMode === false) setOpenState(false);
		const body = {
			masteryId: mastery.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/masteries`),
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
		<>
			<ArraySearchFilter
				array={unacquiredMasteries}
				setFilteredState={setSelectionPool}
				label="Filtro"
				placeholder="Nome | Tipo | Sub Tipo"
				stringKeysToCheck={["name", "slug", "type", "subType"]}
			/>
			<UIBasics.List.Grid
				columnWidth={300}
				direction="column"
				backgroundColor="gray"
				children={selectionPool.map((mastery) => {
					return (
						<StyledLinklikeButton
							key={mastery.id}
							title={mastery.name}
							icon={mastery.iconUrl}
							onClick={() => handleAddMastery(mastery)}
						/>
					);
				})}
			/>
		</>
	);
}
