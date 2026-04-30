import { UIBasics } from "@/components/(UIBasics)";
import { SpellSubType, SpellType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof SpellType) {
	switch (type) {
		// case "Unique":
		// return "🌟[@/[Única]spells#unicas]";
		default:
			return "[@/[Nenhum]spells]";
	}
}
function getTabulatedSubType(subType: keyof typeof SpellSubType) {
	switch (subType) {
		// case "MajorAction":
		// return "⊱⸙Ação Maior⸙";
		case "Unknown":
		default:
			return "[@/[Nenhum]spells]";
	}
}

interface SpellTypologyCalloutProps {
	type: keyof typeof SpellType;
	subType: keyof typeof SpellSubType;
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
