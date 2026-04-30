import { UIBasics } from "@/components/(UIBasics)";
import { TraitSubType, TraitType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof TraitType) {
	switch (type) {
		case "Generic":
			return "[@/[Genérico]tracos#genericos]";
		case "Racial":
			return "[@/[Racial]tracos#raciais]";
		case "Talent":
			return "[@/[Talento]tracos#talentos]";
		case "Blessing":
			return "[@/[Benção]tracos#bencaos]";
		case "Unique":
			return "[@/[Único]tracos#unicos]";
		case "Unknown":
		default:
			return "[@/[Unknown]tracos]";
	}
}
function getTabulatedSubType(subType: keyof typeof TraitSubType) {
	switch (subType) {
		case "Aspect":
			return "[@/[Aspecto]tracos]";
		case "Combat":
			return "[@/[Combate]tracos]";
		case "Intellectual":
			return "[@/[Intelectual]tracos]";
		case "Magic":
			return "[@/[Mágico]tracos]";
		case "Miscellaneous":
			return "[@/[Miscelânico]tracos]";
		case "Sensory":
			return "[@/[Sensorial]tracos]";
		case "Special":
			return "[@/[Especial]tracos]";
		case "Unknown":
		default:
			return "[@/[Unknown]tracos]";
	}
}

interface SkillTypologyCalloutProps {
	type: keyof typeof TraitType;
	subType: keyof typeof TraitSubType;
}
export default function SkillTypologyCallout({
	type,
	subType,
}: SkillTypologyCalloutProps) {
	const tableType = [
		"💮Tipo",
		<UIBasics.Text>{getTabulatedType(type)}</UIBasics.Text>,
	];
	const tableStatus = [
		"🏷️Sub-Tipo",
		<UIBasics.Text>{getTabulatedSubType(subType)}</UIBasics.Text>,
	];

	return (
		<UIBasics.Callout
			icon={{
				name: "IdentificationCard",
				color: "purple",
			}}
			titleColor="gray"
			title={"Tipologia"}>
			<UIBasics.Table
				tableData={{
					tableLanes: [tableType, tableStatus],
				}}
			/>
		</UIBasics.Callout>
	);
}
