import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterParameters, RaceData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

function getParameterGradeSymbol(grade: number) {
	switch (grade) {
		case 0:
			return "0";
		case 1:
			return "🔻";
		case 2:
			return "🔹";
		case 3:
			return "🔺";
		case 4:
			return "⚜️";
	}
	return "?";
}
function tableParameterEntry(
	key: string,
	title: string,
	value: number,
	grade: number,
) {
	return [
		<StyledLink
			title={title}
			href={"/"}
			icon={getAlbinaApiFullAddress(`/favicon/default/misc/parameters/${key}`)}
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
										parameters.arcanePower,
								)}
							/>,
							"",
						],
						tableParameterEntry(
							"vitality",
							"Vitalidade",
							parameters.vitality,
							race.parameters.vitality,
						),
						tableParameterEntry(
							"vigor",
							"Vigor",
							parameters.vigor,
							race.parameters.vigor,
						),
						tableParameterEntry(
							"mana",
							"Manapool",
							parameters.mana,
							race.parameters.manapool,
						),
						tableParameterEntry(
							"physicalMight",
							"P. Física",
							parameters.physicalMight,
							race.parameters.physicalPower,
						),
						tableParameterEntry(
							"arcanePower",
							"P. Mágica",
							parameters.arcanePower,
							race.parameters.magicalPower,
						),
					],
				}}
			/>
		</div>
	);
}
