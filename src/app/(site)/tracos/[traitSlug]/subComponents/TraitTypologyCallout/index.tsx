import { UIBasics } from "@/components/(UIBasics)";

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
