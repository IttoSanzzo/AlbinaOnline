import { StyledLink } from "@/components/(Design)";
import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { CharacterAbilityScore } from "@/libs/stp@types";

function AbilityScoreBonusValue(abilityScore: number) {
	return abilityScore <= 10
		? abilityScore - 10
		: Math.floor((abilityScore - 10) / 3);
}
function AbilityScoreBonusValueText(abilityScore: number) {
	const bonusValue = AbilityScoreBonusValue(abilityScore);
	return (
		<NotionText
			display="block"
			textColor={bonusValue < 0 ? "red" : bonusValue > 0 ? "green" : "gray"}
			textAlign="center">
			{`${bonusValue >= 0 ? "+" : ""}${bonusValue}`}
		</NotionText>
	);
}

interface CharacterAbilityScoreDisplayProps {
	abilityScore: CharacterAbilityScore;
}
export function CharacterAbilityScoreDisplay({
	abilityScore,
}: CharacterAbilityScoreDisplayProps) {
	return (
		<NotionTable
			fixedLinePositions={[1, 3]}
			fixedLineWidths={[50, 11]}
			direction="row"
			tableData={{
				tableLanes: [
					[
						<StyledLink
							title="Força"
							href="https://www.notion.so/albinarpg/For-a-13d4b713f59780e89eddd90d1a189a1f"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.strength}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.strength),
					],
					[
						<StyledLink
							title="Agilidade"
							href="https://www.notion.so/albinarpg/Agilidade-13e4b713f59780b8ace5ffc873fa11f5?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.agility}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.agility),
					],
					[
						<StyledLink
							title="Técnica"
							href="https://www.notion.so/albinarpg/T-cnica-13e4b713f597804490f8de269c441f7a?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.technique}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.technique),
					],
					[
						<StyledLink
							title="Constituição"
							href="https://www.notion.so/albinarpg/Constitui-o-13e4b713f59780f2a2f6ca13724f1c49?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.constitution}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.constitution),
					],
					[
						<StyledLink
							title="Inteligência"
							href="https://www.notion.so/albinarpg/Intelig-ncia-13e4b713f5978091bb15cb4819d2fd61?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.intelligence}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.intelligence),
					],
					[
						<StyledLink
							title="Sabedoria"
							href="https://www.notion.so/albinarpg/Sabedoria-13e4b713f59780bcb506eeccc75e0131?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.wisdom}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.wisdom),
					],
					[
						<StyledLink
							title="Carisma"
							href="https://www.notion.so/albinarpg/Carisma-13e4b713f5978068b57ef9e20c4304df?pvs=25"
							tryAutomaticIcon
						/>,
						<NotionText
							display="block"
							textAlign="center"
							textColor="blue"
							children={`${abilityScore.charisma}`}
						/>,
						AbilityScoreBonusValueText(abilityScore.charisma),
					],
				],
			}}
		/>
	);
}
