import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { useContext, useLayoutEffect } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { CharacterMasteryExpanded, Guid } from "@/libs/stp@types";
import { MasteriesContext } from "../../CharacterEditableSheetContextProviders";
import { UIBasics } from "@/components/(UIBasics)";
import { useCharacterUpdated } from "@/libs/stp@hooks";

interface ParametersAndMasteriesDrawerProps {
	characterId: Guid;
}
export function ParametersAndMasteriesDrawer({
	characterId,
}: ParametersAndMasteriesDrawerProps) {
	const { setCharacterMasteries } = useContext(MasteriesContext);

	async function loadMasteries(): Promise<boolean> {
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/masteries`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) return false;
		const data: CharacterMasteryExpanded[] = await response.json();
		const orderedData = data.sort((a, b) => {
			const nameCompare = a.mastery.name.localeCompare(b.mastery.name);
			if (nameCompare !== 0) return nameCompare;
			return a.level - b.level;
		});
		setCharacterMasteries(orderedData);
		return true;
	}
	useLayoutEffect(() => {
		loadMasteries();
	}, [characterId]);

	useCharacterUpdated(characterId, async () => {
		return await loadMasteries();
	});

	return (
		<CharacterDrawerBaseHeader
			title="Parâmetros & Maestrias"
			memoryId={`${characterId}-ParametersAndMasteries`}
			backgroundColor="blue">
			<UIBasics.MultiColumn.Two
				colum1={<CharacterEditableDataDisplays.Parameters />}
				colum2={<CharacterEditableDataDisplays.AbilityScore />}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Proficiency"}
					/>
				}
				colum2={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Craft"}
					/>
				}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Expertise"}
					/>
				}
				colum2={
					<CharacterEditableDataDisplays.MasteriesFromType
						characterId={characterId}
						type={"Knowledge"}
					/>
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
