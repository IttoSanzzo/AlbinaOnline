import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterAbilityScore } from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

function TableAbilityScoreEntry(key: string, title: string, value: number) {
	return [
		<StyledLink
			title={title}
			href={"/"}
			icon={getAlbinaApiFullAddress(
				`/favicon/default/misc/ability-scores/${key}`,
			)}
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
										abilityScore.charisma,
								)}
							/>,
							"",
						],
						TableAbilityScoreEntry("strength", "Força", abilityScore.strength),
						TableAbilityScoreEntry(
							"agility",
							"Agilidade",
							abilityScore.agility,
						),
						TableAbilityScoreEntry(
							"technique",
							"Técnica",
							abilityScore.technique,
						),
						TableAbilityScoreEntry(
							"constitution",
							"Constituição",
							abilityScore.constitution,
						),
						TableAbilityScoreEntry(
							"intelligence",
							"Inteligência",
							abilityScore.intelligence,
						),
						TableAbilityScoreEntry("wisdom", "Sabedoria", abilityScore.wisdom),
						TableAbilityScoreEntry(
							"charisma",
							"Carisma",
							abilityScore.charisma,
						),
					],
				}}
			/>
		</div>
	);
}
