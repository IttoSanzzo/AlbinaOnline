import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";
import { bonusValueText } from "@/utils/AlbinaAesthetic";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";

interface CreatureViewerProps {
	creatureData: CreatureData;
}
export function CreatureViewer({ creatureData }: CreatureViewerProps) {
	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder>
			<UIBasics.MultiColumn.Two
				colum1={
					<div>
						<UIBasics.Table
							withHeaderColumn={false}
							columnBackgroundColors={["darkGray", undefined, "darkGray"]}
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text textColor="red">🩸HP</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.healthPoints.toString()}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="blue"
											textAlign="flex-center"
											display="flex"
											withBold>
											🛡️CA
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.armorClass.toString()}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text textColor="gray">🚶🏻‍➡️WS</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.speedStats.walkSpeed.toString()}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🏃🏻‍➡️CS
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.speedStats.combatSpeed.toString()}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text textColor="gray">🏊🏻‍♂️SS</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.speedStats.walkSpeed.toString()}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="gray"
											textAlign="flex-center"
											display="flex"
											withBold>
											🪽FS
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.speedStats.combatSpeed.toString()}
										</UIBasics.Text>,
									],
									[
										<UIBasics.Text textColor="orange">
											{"🌟Nível de Desafio"}
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{`${creatureData.level} (${creatureData.experience} XP)`}
										</UIBasics.Text>,
										<UIBasics.Text
											textColor="blue"
											textAlign="flex-center"
											display="flex"
											withBold>
											{"⏱️Iniciativa"}
										</UIBasics.Text>,
										<UIBasics.Text textColor="yellow">
											{creatureData.coreMetrics.speedStats.combatSpeed.toString()}
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
											{creatureData.miscMetrics.resistances.length == 0
												? "Nenhuma"
												: creatureData.miscMetrics.resistances.join(", ")}
										</UIBasics.Text>,
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
										<UIBasics.Text
											withBold
											textAlign="flex-center"
											display="flex"
											textColor="orange">
											Linguas
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
											{"Nenhum"}
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
											{"Nenhum"}
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
		bonusValueText(abilityScoreBonusValue(value)),
	];
}
