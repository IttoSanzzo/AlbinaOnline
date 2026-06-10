import React, { ReactNode } from "react";
import {
	CharacterAbilityScore,
	CharacterMasteryExpanded,
	Guid,
	masteryPluralNames,
	MasteryType,
} from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const MasteriesDrawerContainer = newStyledElement.div(
	styles.masteriesDrawerContainer,
);

function tableMasteryEntry(
	mastery: CharacterMasteryExpanded,
	abilityScore: CharacterAbilityScore,
) {
	let finalAbilityScoreModifier: number | undefined = undefined;

	switch (mastery.mastery.type) {
		case "Expertise":
			finalAbilityScoreModifier = abilityScore[
				mastery.mastery.subType.toLocaleLowerCase() as keyof CharacterAbilityScore
			] as number;
			break;
		case "Knowledge":
			finalAbilityScoreModifier = Math.max(
				abilityScore.intelligence,
				abilityScore.wisdom,
			);
			break;
		case "Craft":
			switch (mastery.mastery.subType) {
				case "Production":
					finalAbilityScoreModifier = Math.max(
						abilityScore.technique,
						abilityScore.intelligence,
					);
					break;
				case "Combatant":
					finalAbilityScoreModifier = Math.max(
						abilityScore.technique,
						abilityScore.strength,
					);
					break;
				case "General":
					finalAbilityScoreModifier = Math.max(
						abilityScore.wisdom,
						abilityScore.intelligence,
						abilityScore.charisma,
					);
					break;
			}
			break;
		default:
			break;
	}

	const bonusValue =
		Number(mastery.level) +
		(finalAbilityScoreModifier !== undefined
			? abilityScoreBonusValue(finalAbilityScoreModifier)
			: 0);
	return [
		<StyledLink
			style={{ marginRight: "2px" }}
			titleStyle={{
				textAlign: "left",
				minWidth: "400px",
			}}
			title={mastery.mastery.name}
			href={`/maestrias/${mastery.mastery.slug}`}
			icon={getAlbinaApiFullAddress(
				`/favicon/masteries/${mastery.mastery.slug}`,
			)}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			children={mastery.level.toString()}
		/>,
		bonusValueText(bonusValue),
	];
}
const tableHeaderRow = (title: string = "Nome") => [
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

function formTable(
	title: string,
	masteries: CharacterMasteryExpanded[],
	abilityScore: CharacterAbilityScore,
): ReactNode[][] {
	if (masteries.length == 0) {
		return [
			tableHeaderRow(title),
			[
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
			return tableMasteryEntry(mastery, abilityScore);
		}),
	];
}

function formSubTable(
	masteries: CharacterMasteryExpanded[],
): (ReactNode | undefined)[] {
	if (masteries.length == 0) return [undefined, undefined];
	return [
		undefined,
		...masteries.map((mastery) => {
			if (mastery.notes.length == 0) return undefined;
			return (
				<UIBasics.Toggle
					floatingReverseButton
					withoutPadding
					contentMargin="none"
					buttonStyle={{
						top: "-28px",
					}}
					memoryId={`${mastery.characterId}-masteries-${mastery.masteryId}-notes`}
					key={mastery.id}>
					<p
						style={{
							border: "5px solid var(--cl-gray-800)",
							borderRight: 0,
							borderTop: 0,
							padding: "var(--sp-1) var(--sp-3)",
							display: "block",
							whiteSpace: "pre-wrap",
						}}>
						{mastery.notes}
					</p>
				</UIBasics.Toggle>
			);
		}),
	];
}

interface CharacterMasteriesFromTypeDisplayProps {
	characterId: Guid;
	type: keyof typeof MasteryType;
	abilityScore: CharacterAbilityScore;
	characterMasteries: CharacterMasteryExpanded[];
}
function _CharacterMasteriesFromTypeDisplay({
	type,
	abilityScore,
	characterMasteries,
}: CharacterMasteriesFromTypeDisplayProps) {
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
					fixedLinePositions={[2, 3]}
					fixedLineWidths={[15, 19]}
					direction="row"
					withHeaderRow
					withoutMargin
					tableData={{
						tableLanes: formTable(
							masteryPluralNames[type],
							masteriesFromThisType,
							abilityScore,
						),
						subLanes: formSubTable(masteriesFromThisType),
					}}
				/>
			</MasteriesDrawerContainer>
		</UIBasics.Box>
	);
}

export const CharacterMasteriesFromTypeDisplay = React.memo(
	_CharacterMasteriesFromTypeDisplay,
);
