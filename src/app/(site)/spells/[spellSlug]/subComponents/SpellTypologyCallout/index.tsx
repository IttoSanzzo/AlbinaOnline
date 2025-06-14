import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "Unique":
			return "🌟[@/[Única]spells#unicas]";
		default:
			return "Unknown?";
	}
}
function getTabulatedSubType(subType: string) {
	switch (subType) {
		case "MajorAction":
			return "⊱⸙Ação Maior⸙";
		default:
			return "Unknown?";
	}
}

interface SpellTypologyCalloutProps {
	type: string;
	subType: string;
}
export default function SpellTypologyCallout({
	type,
	subType,
}: SpellTypologyCalloutProps) {
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
