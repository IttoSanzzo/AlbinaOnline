import { UIBasics } from "@/components/(UIBasics)";
import { SkillSubType, SkillType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof SkillType) {
	switch (type) {
		case "Generic":
			return "[@/[Genérica]skills#genericas]";
		case "Common":
			return "[@/[Comum]skills#comuns]";
		case "Racial":
			return "[@/[Racial]skills#racias]";
		case "Unique":
			return "[@/[Única]skills#unicas]";
		case "Unknown":
		default:
			return "[@/[Unknown]skills]";
	}
}
function getTabulatedSubType(subType: keyof typeof SkillSubType) {
	switch (subType) {
		case "Aspect":
			return "[@/[Aspecto]skills]";
		case "Combat":
			return "[@/[Combate]skills]";
		case "Intellectual":
			return "[@/[Intelectual]skills]";
		case "Magic":
			return "[@/[Mágica]skills]";
		case "Miscellaneous":
			return "[@/[Miscelânica]skills]";
		case "Sensory":
			return "[@/[Sensorial]skills]";
		case "Special":
			return "[@/[Especial]skills]";
		case "Unknown":
		default:
			return "[@/[Unknown]skills]";
	}
}

interface SkillTypologyCalloutProps {
	type: keyof typeof SkillType;
	subType: keyof typeof SkillSubType;
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
