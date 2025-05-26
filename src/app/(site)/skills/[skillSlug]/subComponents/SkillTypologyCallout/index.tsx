import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

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
function getTabulatedCategory(subType: string) {
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
		<NotionText>{getTabulatedType(type)}</NotionText>,
	];
	const tableStatus = [
		"🏷️Sub-Tipo",
		<NotionText>{getTabulatedCategory(subType)}</NotionText>,
	];

	return (
		<NotionCallout
			icon={{
				name: "IdentificationCard",
				color: "purple",
			}}
			titleColor="gray"
			title={"Tipologia"}>
			<NotionTable
				tableData={{
					tableLanes: [tableType, tableStatus],
				}}
			/>
		</NotionCallout>
	);
}
