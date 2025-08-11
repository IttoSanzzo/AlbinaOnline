import { UIBasics } from "@/components/(UIBasics)";

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
