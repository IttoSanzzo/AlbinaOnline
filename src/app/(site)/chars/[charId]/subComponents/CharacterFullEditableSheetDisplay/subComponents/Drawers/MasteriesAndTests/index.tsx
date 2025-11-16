import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { useContext, useLayoutEffect } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { CharacterMasteryExpanded, Guid } from "@/libs/stp@types";
import { MasteriesContext } from "../../CharacterEditableSheetContextProviders";
import React from "react";
import { UIBasics } from "@/components/(UIBasics)";

interface MasteriesAndTestsDrawerProps {
	characterId: Guid;
}
export function MasteriesAndTestsDrawer({
	characterId,
}: MasteriesAndTestsDrawerProps) {
	const { setCharacterMasteries } = useContext(MasteriesContext);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/masteries`),
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then((response) => {
			if (!response.ok) throw new Error("Failed to fetch masteries");
			response.json().then((data: CharacterMasteryExpanded[]) => {
				const orderedData = data.sort((a, b) => {
					const nameCompare = a.mastery.name.localeCompare(b.mastery.name);
					if (nameCompare !== 0) return nameCompare;
					return a.level - b.level;
				});
				setCharacterMasteries(orderedData);
			});
		});
	}, [characterId]);

	return (
		<CharacterDrawerBaseHeader
			title="Maestrias & Testes"
			memoryId={`${characterId}-MasteriesAndTests`}
			backgroundColor="blue">
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
