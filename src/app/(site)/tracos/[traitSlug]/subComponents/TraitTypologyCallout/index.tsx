import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "Generic":
			return "🌟[@/[Genérico]tracos#genericos]";
		case "Racial":
			return "🌟[@/[Racial]tracos#raciais]";
		case "Talent":
			return "🌟[@/[Talento]tracos#talentos]";
		case "Blessing":
			return "🌟[@/[Benção]tracos#bencaos]";
		case "Unique":
			return "🌟[@/[Único]tracos#unicos]";
		default:
			return "Unknown?";
	}
}
function getTabulatedSubType(subType: string) {
	switch (subType) {
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
		<NotionText>{getTabulatedSubType(subType)}</NotionText>,
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
