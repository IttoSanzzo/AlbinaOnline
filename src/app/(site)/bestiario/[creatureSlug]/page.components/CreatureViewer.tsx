import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { creatureAbilityScoreBonusValue } from "@/utils/AlbinaMath";

interface CreatureViewerProps {
	creatureData: CreatureData;
}
export function CreatureViewer({ creatureData }: CreatureViewerProps) {
	let testBonusesString = Object.entries(creatureData.miscMetrics.testBonuses)
		.map((entry) => `${entry[0]}: ${entry[1] > 0 ? `+${entry[1]}` : entry[1]}`)
		.join(", ");
	if (testBonusesString == "") testBonusesString = "Nenhum";
	let sensesString = Object.entries(creatureData.miscMetrics.senses)
		.map((entry) => `${entry[0]}: ${entry[1]}`)
		.join(", ");
	if (sensesString == "") sensesString = "Nenhum";

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder>
			<UIBasics.MultiColumn.Two
				colum1={
					<div>
						<UIBasics.Table
							withHeaderColumn={false}
							direction="row"
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Atributos
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{creatureData.magicAttributes.length == 0
												? "Nenhum"
												: creatureData.magicAttributes.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							withHeaderColumn={false}
							columnBackgroundColors={["darkGray", undefined, "darkGray"]}
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text textColor="red">🩸 HP</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.healthPoints.toString()}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="blue"
											textAlign="flex-center"
											display="flex"
											withBold>
											🛡️ CA
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.armorClass.toString()}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text textColor="gray">
											🚶🏻‍➡️ Caminhada
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.walk}m`}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🏊🏻‍♂️ Nado
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.swim ?? 0}m`}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🏃🏻‍➡️ Combate
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.combat}m`}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🪽 Voo
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.fly ?? 0}m`}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🧗🏻‍♂️ Escalada
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.climb ?? 0}m`}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🪏 Cavar
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.speedStats.burrow ?? 0}m`}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text textColor="orange">
											{"🌟 Nível de Desafio"}
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.level} (${creatureData.experience} XP)`}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="blue"
											textAlign="flex-center"
											display="flex"
											withBold>
											{"⏱️ Iniciativa"}
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.coreMetrics.initiative}`}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							withHeaderColumn={false}
							direction="row"
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Vulnerabilidades
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{creatureData.miscMetrics.vulnerabilities.length == 0
												? "Nenhuma"
												: creatureData.miscMetrics.vulnerabilities.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							withHeaderColumn={false}
							direction="row"
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Resistências
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{creatureData.miscMetrics.resistances.length == 0
												? "Nenhuma"
												: creatureData.miscMetrics.resistances.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							withHeaderColumn={false}
							direction="row"
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Imunidades
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{creatureData.miscMetrics.immunities.length == 0
												? "Nenhuma"
												: creatureData.miscMetrics.immunities.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
					</div>
				}
				colum2={
					<div>
						<UIBasics.Table
							withHeaderColumn={false}
							columnBackgroundColors={["darkGray", undefined, "darkGray"]}
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
												creatureData.abilityScore.strength +
													creatureData.abilityScore.agility +
													creatureData.abilityScore.technique +
													creatureData.abilityScore.constitution +
													creatureData.abilityScore.intelligence +
													creatureData.abilityScore.wisdom +
													creatureData.abilityScore.charisma,
											)}
										/>,
										"",
									],
									TableAbilityScoreEntry(
										"strength",
										"Força",
										creatureData.abilityScore.strength,
									),
									TableAbilityScoreEntry(
										"agility",
										"Agilidade",
										creatureData.abilityScore.agility,
									),
									TableAbilityScoreEntry(
										"technique",
										"Técnica",
										creatureData.abilityScore.technique,
									),
									TableAbilityScoreEntry(
										"constitution",
										"Constituição",
										creatureData.abilityScore.constitution,
									),
									TableAbilityScoreEntry(
										"intelligence",
										"Inteligência",
										creatureData.abilityScore.intelligence,
									),
									TableAbilityScoreEntry(
										"wisdom",
										"Sabedoria",
										creatureData.abilityScore.wisdom,
									),
									TableAbilityScoreEntry(
										"charisma",
										"Carisma",
										creatureData.abilityScore.charisma,
									),
								],
							}}
						/>
						<span style={{ display: "flex", height: "5px" }} />
						<UIBasics.Table
							fixedLinePositions={[1]}
							fixedLineWidths={[15]}
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Testes
										</UIBasics.Text>,
										<UIBasics.Text
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{testBonusesString}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							fixedLinePositions={[1]}
							fixedLineWidths={[15]}
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Sentidos
										</UIBasics.Text>,
										<UIBasics.Text
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{sensesString}
										</UIBasics.Text>,
									],
								],
							}}
						/>
						<UIBasics.Table
							withHeaderColumn={false}
							direction="row"
							withHeaderRow
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Línguas
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="gray">
											{creatureData.miscMetrics.languages.length == 0
												? "Nenhuma"
												: creatureData.miscMetrics.languages.join(", ")}
										</UIBasics.Text>,
									],
								],
							}}
						/>
					</div>
				}
			/>
		</UIBasics.Box>
	);
}

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
		bonusValueText(creatureAbilityScoreBonusValue(value)),
	];
}
