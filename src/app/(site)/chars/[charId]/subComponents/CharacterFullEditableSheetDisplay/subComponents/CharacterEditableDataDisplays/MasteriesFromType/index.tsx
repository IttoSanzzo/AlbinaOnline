import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionTable, NotionText } from "@/components/(NotionBased)";
import { useContext, useLayoutEffect, useState } from "react";
import { AbilityScoreContext } from "../../CharacterEditableSheetContextProviders";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	MasteryType,
} from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

function tableMasteryEntry(
	name: string,
	slug: string,
	level: number,
	abilityScore?: number
) {
	return [
		<StyledLink
			title={name}
			href={`/maestrias/${slug}`}
			icon={`${getAlbinaApiAddress()}/favicon/maestrias/${slug}`}
		/>,
		<NotionText
			textAlign="center"
			display="block"
			children={String(level)}
		/>,
		bonusValueText(
			level +
				(abilityScore !== undefined ? abilityScoreBonusValue(abilityScore) : 0)
		),
	];
}
interface CharacterMasteriesFromTypeDisplayProps {
	characterId: string;
	type: keyof typeof MasteryType;
}
export function CharacterMasteriesFromTypeDisplay({
	characterId,
	type,
}: CharacterMasteriesFromTypeDisplayProps) {
	// const [errorMessage, setErrorMessage] = useState<string>("");
	const { abilityScore } = useContext(AbilityScoreContext);
	const [masteries, setMasteries] = useState<CharacterMasteryExpanded[]>([]);
	// const { masteries, setMasteries } = useContext(MasteriesContext);
	useLayoutEffect(() => {
		authenticatedFetchAsync(
			`${getAlbinaApiAddress()}/chars/${characterId}/masteries?type=${type}`,
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
				setMasteries(orderedData);
			});
		});
	}, [characterId, type]);

	return (
		<NotionBox
			withoutBorder
			withoutMargin
			withoutPadding>
			<NotionTable
				fixedLinePositions={[1]}
				fixedLineWidths={[50]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<NotionText
								textAlign="center"
								display="block"
								textColor="gray"
								children="Nome"
							/>,
							<NotionText
								textAlign="center"
								display="block"
								textColor="gray"
								children="Nível"
							/>,
							<NotionText
								textAlign="center"
								display="block"
								textColor="gray"
								children="Bônus"
							/>,
						],
						...masteries.map((mastery) => {
							switch (mastery.mastery.type) {
								case "Proficiency":
									return tableMasteryEntry(
										mastery.mastery.name,
										mastery.mastery.slug,
										mastery.level
									);
								case "Expertise":
									return tableMasteryEntry(
										mastery.mastery.name,
										mastery.mastery.slug,
										mastery.level,
										abilityScore[
											mastery.mastery.subType.toLocaleLowerCase() as keyof CharacterAbilityScore
										] as number
									);
								case "Knowledge":
									return tableMasteryEntry(
										mastery.mastery.name,
										mastery.mastery.slug,
										mastery.level,
										Math.max(abilityScore.intelligence, abilityScore.wisdom)
									);
								case "Craft":
									switch (mastery.mastery.subType) {
										case "Production":
											return tableMasteryEntry(
												mastery.mastery.name,
												mastery.mastery.slug,
												mastery.level,
												Math.max(
													abilityScore.technique,
													abilityScore.intelligence
												)
											);
										case "Combatant":
											return tableMasteryEntry(
												mastery.mastery.name,
												mastery.mastery.slug,
												mastery.level,
												Math.max(abilityScore.technique, abilityScore.strength)
											);
										case "General":
											return tableMasteryEntry(
												mastery.mastery.name,
												mastery.mastery.slug,
												mastery.level,
												Math.max(
													abilityScore.wisdom,
													abilityScore.intelligence,
													abilityScore.charisma
												)
											);
									}
								default:
									return tableMasteryEntry(
										mastery.mastery.name,
										mastery.mastery.slug,
										mastery.level
									);
							}
						}),
					],
				}}
			/>
		</NotionBox>
	);
}
