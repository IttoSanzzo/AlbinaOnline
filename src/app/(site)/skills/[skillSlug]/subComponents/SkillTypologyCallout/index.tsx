import { UIBasics } from "@/components/(UIBasics)";

function getTabulatedType(type: string) {
	switch (type) {
		case "Generic":
			return "🌟[@/[Genérica]skills#genericas]";
		case "Common":
			return "🌟[@/[Comum]skills#comuns]";
		case "Racial":
			return "🌟[@/[Racial]skills#racias]";
		case "Unique":
			return "🌟[@/[Única]skills#unicas]";
		default:
			return "Unknown?";
	}
}
function getTabulatedSubType(subType: string) {
	switch (subType) {
		case "MajorAction":
			return "⊱⸙Ação Maior⸙";
		case "MinorAction":
			return "⊱⸙Ação Menor⸙";
		case "MajorReaction":
			return "⊱⸙Reação Maior⸙";
		case "MinorReaction":
			return "⊱⸙Reação Menor⸙";
		default:
			return "Unknown?";
	}
}

interface SkillTypologyCalloutProps {
	type: string;
	subType: string;
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
