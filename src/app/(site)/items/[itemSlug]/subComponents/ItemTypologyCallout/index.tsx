import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "":
			return "🌟[@/[]items#]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(subType: string) {
	switch (subType) {
		case "":
			return "⊱⸙⸙";
		default:
			return "Unknown?";
	}
}

interface ItemTypologyCalloutProps {
	type: string;
	subType: string;
}
export default function ItemTypologyCallout({
	type,
	subType,
}: ItemTypologyCalloutProps) {
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
