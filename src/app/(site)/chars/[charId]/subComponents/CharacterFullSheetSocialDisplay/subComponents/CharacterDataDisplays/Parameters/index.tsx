import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterParameters, RaceData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Fragment } from "react/jsx-runtime";

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
function getParameterGradeTotalLevel(grade: number, points: number) {
	switch (grade) {
		case 0:
			return -1;
		case 1:
			return Math.floor(points / 2);
		case 2:
			return Math.floor(points / 1.5);
		case 3:
			return Math.floor(points / 1.5);
		case 4:
			return points;
	}
	return -1;
}
function tableParameterEntry(
	key: string,
	title: string,
	investedPoints: number,
	grade: number,
) {
	const totalLevel = getParameterGradeTotalLevel(grade, investedPoints);
	return [
		<StyledLink
			title={title}
			href={"/"}
			icon={getAlbinaApiFullAddress(`/favicon/default/misc/parameters/${key}`)}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			children={getParameterGradeSymbol(grade)}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			textColor="darkGray"
			children={investedPoints.toString()}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			textColor="orange"
			children={`${totalLevel != 0 ? totalLevel : ""}`}
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
				fixedLinePositions={[1, 2, 4]}
				fixedLineWidths={[50, 12, 12]}
				columnBackgroundColors={[undefined, "darkGray", undefined, "darkGray"]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textColor="gray"
								children={"Total"}
							/>,
							<Fragment />,
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
							<Fragment />,
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
