"use client";

import React, { ReactNode, useContext } from "react";
import {
	AbilityScoreContext,
	MasteriesContext,
} from "../../CharacterEditableSheetContextProviders";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	Guid,
	masteryPluralNames,
	MasteryType,
} from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";
import { MasteryLinkWithDeletion } from "./subComponents/MasteryLinkWithDeletion";
import { AddMasteryButton } from "./subComponents/AddMasteryButton";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { MasteryLevelController } from "./subComponents/MasteryLevelController";
import { UIBasics } from "@/components/(UIBasics)";
import { postDiceRoll } from "@/components/(SPECIAL)/components/DiceRoller/subcomponents/DiceRollerCore";

const MasteriesDrawerContainer = newStyledElement.div(
	styles.masteriesDrawerContainer,
);

function tableMasteryEntry(
	characterId: Guid,
	masteryId: Guid,
	name: string,
	slug: string,
	level: number,
	abilityScore?: number,
) {
	const bonusValue =
		Number(level) +
		(abilityScore !== undefined ? abilityScoreBonusValue(abilityScore) : 0);
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
		<span
			style={{ background: "none", border: "none", cursor: "pointer" }}
			title="Clique para rolar"
			onClick={() => {
				postDiceRoll(`1d20${bonusValue >= 0 ? "+" : ""}${bonusValue}`, {
					showToast: true,
					saveToHistory: true,
				});
			}}>
			{bonusValueText(bonusValue)}
		</span>,
	];
}
function tableHeaderRow(title: string) {
	return [
		<UIBasics.Text
			textAlign="center"
			display="block"
			textColor="gray"
			children={title}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			textColor="gray"
			children="Nível"
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			textColor="gray"
			children="Bônus"
		/>,
	];
}
function formTable(
	title: string,
	masteries: CharacterMasteryExpanded[],
	abilityScore: CharacterAbilityScore,
): ReactNode[][] {
	if (masteries.length == 0) {
		return [
			tableHeaderRow(title),
			[
				"-",
				<UIBasics.Text
					textAlign="center"
					display="block"
					children="-"
				/>,
				<UIBasics.Text
					textAlign="center"
					display="block"
					children="-"
				/>,
			],
		];
	}
	return [
		tableHeaderRow(title),
		...masteries.map((mastery) => {
			switch (mastery.mastery.type) {
				case "Proficiency":
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level,
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
						] as number,
					);
				case "Knowledge":
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level,
						Math.max(abilityScore.intelligence, abilityScore.wisdom),
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
								Math.max(abilityScore.technique, abilityScore.intelligence),
							);
						case "Combatant":
							return tableMasteryEntry(
								mastery.characterId,
								mastery.mastery.id,
								mastery.mastery.name,
								mastery.mastery.slug,
								mastery.level,
								Math.max(abilityScore.technique, abilityScore.strength),
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
									abilityScore.charisma,
								),
							);
					}
				// no-fallthrough
				default:
					return tableMasteryEntry(
						mastery.characterId,
						mastery.mastery.id,
						mastery.mastery.name,
						mastery.mastery.slug,
						mastery.level,
					);
			}
		}),
	];
}

interface CharacterMasteriesFromTypeDisplayProps {
	characterId: Guid;
	type: keyof typeof MasteryType;
}
function _CharacterMasteriesFromTypeDisplay({
	characterId,
	type,
}: CharacterMasteriesFromTypeDisplayProps) {
	const { abilityScore } = useContext(AbilityScoreContext);
	const { characterMasteries } = useContext(MasteriesContext);

	const masteriesFromThisType = characterMasteries.filter(
		(mastery) => mastery.mastery.type == type,
	);

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin={type == "Proficiency" || type == "Craft"}
			withoutPadding>
			<MasteriesDrawerContainer>
				<UIBasics.Table
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 19]}
					direction="row"
					withHeaderRow
					withoutMargin
					tableData={{
						tableLanes: formTable(
							masteryPluralNames[type],
							masteriesFromThisType,
							abilityScore,
						),
					}}
				/>
				<AddMasteryButton
					masteries={masteriesFromThisType}
					characterId={characterId}
					type={type}
				/>
			</MasteriesDrawerContainer>
		</UIBasics.Box>
	);
}

export const CharacterMasteriesFromTypeDisplay = React.memo(
	_CharacterMasteriesFromTypeDisplay,
);
