import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterAbilityScore } from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

function TableAbilityScoreEntry(title: string, value: number) {
	return [
		<StyledLink
			title={title}
			href={"/"}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			textColor="blue"
			children={value.toString()}
		/>,
		bonusValueText(abilityScoreBonusValue(value)),
	];
}

interface CharacterAbilityScoreDisplayProps {
	abilityScore: CharacterAbilityScore;
}
export function CharacterAbilityScoreDisplay({
	abilityScore,
}: CharacterAbilityScoreDisplayProps) {
	return (
		<div style={{ display: "flex" }}>
			<UIBasics.Table
				fixedLinePositions={[1, 3]}
				fixedLineWidths={[50, 12]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textColor="gray"
								children={"Total"}
							/>,
							<UIBasics.Text
								display="block"
								textAlign="center"
								textColor="gray"
								children={String(
									abilityScore.strength +
										abilityScore.agility +
										abilityScore.technique +
										abilityScore.constitution +
										abilityScore.intelligence +
										abilityScore.wisdom +
										abilityScore.charisma
								)}
							/>,
							"",
						],
						TableAbilityScoreEntry("Força", abilityScore.strength),
						TableAbilityScoreEntry("Agilidade", abilityScore.agility),
						TableAbilityScoreEntry("Técnica", abilityScore.technique),
						TableAbilityScoreEntry("Constituição", abilityScore.constitution),
						TableAbilityScoreEntry("Inteligência", abilityScore.intelligence),
						TableAbilityScoreEntry("Sabedoria", abilityScore.wisdom),
						TableAbilityScoreEntry("Carisma", abilityScore.charisma),
					],
				}}
			/>
		</div>
	);
}
