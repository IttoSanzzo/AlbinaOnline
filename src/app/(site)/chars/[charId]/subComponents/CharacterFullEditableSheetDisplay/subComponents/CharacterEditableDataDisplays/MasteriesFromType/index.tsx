"use client";

import {
	NotionBox,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import React, { ReactNode, useContext } from "react";
import {
	AbilityScoreContext,
	MasteriesContext,
} from "../../CharacterEditableSheetContextProviders";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	masteryNames,
	MasteryType,
} from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";
import { MasteryLinkWithDeletion } from "./subComponents/MasteryLinkWithDeletion";
import { AddMasteryButton } from "./subComponents/AddMasteryButton";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { MasteryLevelController } from "./subComponents/MasteryLevelController";

const MasteriesDrawerContainer = newStyledElement.div(
	styles.masteriesDrawerContainer
);

function tableMasteryEntry(
	characterId: string,
	masteryId: string,
	name: string,
	slug: string,
	level: number,
	abilityScore?: number
) {
	return [
		<MasteryLinkWithDeletion
			characterId={characterId}
			masteryId={masteryId}
			name={name}
			slug={slug}
		/>,
		<MasteryLevelController
			level={level}
			characterId={characterId}
			masteryId={masteryId}
		/>,
		bonusValueText(
			level +
				(abilityScore !== undefined ? abilityScoreBonusValue(abilityScore) : 0)
		),
	];
}
function tableHeaderRow() {
	return [
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
	];
}
function formTable(
	masteries: CharacterMasteryExpanded[],
	abilityScore: CharacterAbilityScore
): ReactNode[][] {
	if (masteries.length == 0) {
		return [
			tableHeaderRow(),
			[
				"-",
				<NotionText
					textAlign="center"
					display="block"
					children="-"
				/>,
				<NotionText
					textAlign="center"
					display="block"
					children="-"
				/>,
			],
		];
	}
	return [
		tableHeaderRow(),
		...masteries.map((mastery) => {
			switch (mastery.mastery.type) {
				case "Proficiency":
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level
					);
				case "Expertise":
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level,
						abilityScore[
							mastery.mastery.subType.toLocaleLowerCase() as keyof CharacterAbilityScore
						] as number
					);
				case "Knowledge":
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level,
						Math.max(abilityScore.intelligence, abilityScore.wisdom)
					);
				case "Craft":
					switch (mastery.mastery.subType) {
						case "Production":
							return tableMasteryEntry(
								mastery.characterId,
								mastery.mastery.id,
								mastery.mastery.name,
								mastery.mastery.slug,
								mastery.level,
								Math.max(abilityScore.technique, abilityScore.intelligence)
							);
						case "Combatant":
							return tableMasteryEntry(
								mastery.characterId,
								mastery.mastery.id,
								mastery.mastery.name,
								mastery.mastery.slug,
								mastery.level,
								Math.max(abilityScore.technique, abilityScore.strength)
							);
						case "General":
							return tableMasteryEntry(
								mastery.characterId,
								mastery.mastery.id,
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
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level
					);
			}
		}),
	];
}

interface CharacterMasteriesFromTypeDisplayProps {
	characterId: string;
	type: keyof typeof MasteryType;
}
export function _CharacterMasteriesFromTypeDisplay({
	characterId,
	type,
}: CharacterMasteriesFromTypeDisplayProps) {
	const { abilityScore } = useContext(AbilityScoreContext);
	const { characterMasteries } = useContext(MasteriesContext);

	const masteriesFromThisType = characterMasteries.filter(
		(mastery) => mastery.mastery.type == type
	);

	return (
		<NotionBox
			backgroundColor="darkGray"
			withoutBorder
			withoutMargin={type == "Proficiency" || type == "Craft"}
			withoutPadding>
			<MasteriesDrawerContainer>
				<NotionToggleHeader
					memoryId={`${characterId}-${type}s`}
					contentMargin="none"
					textColor="yellow"
					headerType="h2"
					titleColor="orange"
					title={`${masteryNames[type]}s`}>
					<NotionTable
						fixedLinePositions={[1, 3]}
						fixedLineWidths={[50, 19]}
						direction="row"
						withHeaderRow
						tableData={{
							tableLanes: formTable(masteriesFromThisType, abilityScore),
						}}
					/>
				</NotionToggleHeader>
				<AddMasteryButton
					masteries={masteriesFromThisType}
					characterId={characterId}
					type={type}
				/>
			</MasteriesDrawerContainer>
		</NotionBox>
	);
}

function areEqual(
	prevProps: CharacterMasteriesFromTypeDisplayProps,
	nextProps: CharacterMasteriesFromTypeDisplayProps
) {
	return (
		prevProps.characterId === nextProps.characterId &&
		prevProps.type === nextProps.type
	);
}
export const CharacterMasteriesFromTypeDisplay = React.memo(
	_CharacterMasteriesFromTypeDisplay,
	areEqual
);
