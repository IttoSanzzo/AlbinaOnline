import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterParameters, RaceData } from "@/libs/stp@types";

function getParameterGradeSymbol(grade: number) {
	switch (grade) {
		case 1:
			return "🔻";
		case 2:
			return "🔸";
		case 3:
			return "🔺";
	}
	return "?";
}
function tableParameterEntry(title: string, value: number, grade: number) {
	return [
		<StyledLink
			title={title}
			href={"/"}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			textColor="orange"
			children={value.toString()}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			children={getParameterGradeSymbol(grade)}
		/>,
	];
}

interface CharacterParametersDisplayProps {
	parameters: CharacterParameters;
	race: RaceData;
}
export function CharacterParametersDisplay({
	parameters,
	race,
}: CharacterParametersDisplayProps) {
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
									parameters.vitality +
										parameters.vigor +
										parameters.mana +
										parameters.physicalMight +
										parameters.arcanePower
								)}
							/>,
							"",
						],
						tableParameterEntry(
							"Vitalidade",
							parameters.vitality,
							race.parameters.vitality
						),
						tableParameterEntry(
							"Vigor",
							parameters.vigor,
							race.parameters.vigor
						),
						tableParameterEntry(
							"Manapool",
							parameters.mana,
							race.parameters.manapool
						),
						tableParameterEntry(
							"P. Físico",
							parameters.physicalMight,
							race.parameters.physicalPower
						),
						tableParameterEntry(
							"P. Mágico",
							parameters.arcanePower,
							race.parameters.magicalPower
						),
					],
				}}
			/>
		</div>
	);
}
