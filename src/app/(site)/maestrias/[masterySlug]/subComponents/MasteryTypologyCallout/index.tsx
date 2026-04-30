import { UIBasics } from "@/components/(UIBasics)";
import { MasterySubType, MasteryType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof MasteryType) {
	switch (type) {
		case "Proficiency":
			return "[@/[🌟Proficiências]maestrias#proficiencias]";
		case "Expertise":
			return "[@/[🪡Perícias]maestrias#pericias]";
		case "Knowledge":
			return "[@/[📖Conhecimentos]maestrias#conhecimentos]";
		case "Craft":
			return "[@/[👜Ofícios]maestrias#oficios]";
		default:
			return "[@/[Unknown]maestrias]";
	}
}
function getTabulatedCategory(subType: keyof typeof MasterySubType) {
	switch (subType) {
		case "Agility":
			return "[@/[🦵🏻Agilidade]maestrias]";
		case "Intelligence":
			return "[@/[🧠Inteligência]maestrias]";
		case "Strength":
			return "[@/[💪🏻Força]maestrias]";
		case "Constitution":
			return "[@/[🍻Constituição]maestrias]";
		case "Technique":
			return "[@/[🤏🏻Técnica]maestrias]";
		case "Charisma":
			return "[@/[🎭Carisma]maestrias]";
		case "Wisdom":
			return "[@/[🧙🏻‍♂️Sabedoria]maestrias]";
		case "Singular":
			return "[@/[📘Singular]maestrias]";
		case "Multiple":
			return "[@/[📚Múltiplo]maestrias]";
		case "General":
			return "[@/[👔Geral]maestrias]";
		case "Combatant":
			return "[@/[🥋Combatente]maestrias]";
		case "Production":
			return "[@/[🥽Produção]maestrias]";
		case "Armed":
			return "[@/[⚔️Armada]maestrias]";
		case "Armored":
			return "[@/[🛡️Defensiva]maestrias]";
		case "Focus":
			return "[@/[🪄Foco]maestrias]";
		case "CombatStyle":
			return "[@/[🎖️Estilo de Combate]maestrias]";
		case "Tool":
			return "[@/[🛠️Ferramenta]maestrias]";
		case "Unknown":
		default:
			return "[@/[Unknown]maestrias]";
	}
}

interface MasteryTypologyCalloutProps {
	type: keyof typeof MasteryType;
	subType: keyof typeof MasterySubType;
}
export default function MasteryTypologyCallout({
	type,
	subType,
}: MasteryTypologyCalloutProps) {
	const tableType = [
		"💮Tipo",
		<UIBasics.Text>{getTabulatedType(type)}</UIBasics.Text>,
	];
	const tableStatus = [
		"🏷️Categoria",
		<UIBasics.Text>{getTabulatedCategory(subType)}</UIBasics.Text>,
	];

	return (
		<>
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
		</>
	);
}
