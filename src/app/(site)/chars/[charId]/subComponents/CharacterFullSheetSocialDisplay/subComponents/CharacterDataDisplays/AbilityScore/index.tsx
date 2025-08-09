import { StyledLink } from "@/components/(Design)";
import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { CharacterAbilityScore } from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

function TableAbilityScoreEntry(title: string, value: number) {
	return [
		<StyledLink
			title={title}
			href={"/"}
		/>,
		<NotionText
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
			<NotionTable
				fixedLinePositions={[1, 3]}
				fixedLineWidths={[50, 12]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<NotionText
								textColor="gray"
								children={"Total"}
							/>,
							<NotionText
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
