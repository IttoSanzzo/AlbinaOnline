import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "Proficiency":
			return "🌟[@/[Proficiências]maestrias#proficiencias]";
		case "Expertise":
			return "🪡[@/[Perícias]maestrias#pericias]";
		case "Knowledge":
			return "📖[@/[Conhecimentos]maestrias#conhecimentos]";
		case "Craft":
			return "👜[@/[Ofícios]maestrias#oficios]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(subType: string) {
	switch (subType) {
		case "Agility":
			return "⊱🦵🏻⸙Agilidade⸙";
		case "Intelligence":
			return "⊱🧠⸙Inteligência⸙";
		case "Strength":
			return "⊱💪🏻⸙Força⸙";
		case "Constitution":
			return "⊱🍻⸙Constituição⸙";
		case "Technique":
			return "⊱🤏🏻⸙Técnica⸙";
		case "Charisma":
			return "⊱🎭⸙Carisma⸙";
		case "Wisdom":
			return "⊱🧙🏻‍♂️⸙Sabedoria⸙";
		case "Singular":
			return "⊱📘⸙Singular⸙";
		case "Multiple":
			return "⊱📚⸙Múltiplo⸙";
		case "General":
			return "⊱👔⸙Geral⸙";
		case "Combatant":
			return "⊱🥋⸙Combatente⸙";
		case "Production":
			return "⊱🥽⸙Produção⸙";
		case "Armed":
			return "⊱⚔️⸙Armada⸙";
		case "Armored":
			return "⊱🛡️⸙Defensiva⸙";
		case "Focus":
			return "⊱🪄⸙Foco⸙";
		case "CombatStyle":
			return "⊱🎖️⸙Estilo de Combate⸙";
		case "Tool":
			return "⊱🛠️⸙Ferramenta⸙";
		default:
			return "⊱Unknown?";
	}
}

interface MasteryTypologyCalloutProps {
	type: string;
	subType: string;
}
export default function MasteryTypologyCallout({
	type,
	subType,
}: MasteryTypologyCalloutProps) {
	const tableType = [
		"💮Tipo",
		<NotionText>{getTabulatedType(type)}</NotionText>,
	];
	const tableStatus = [
		"🏷️Categoria",
		<NotionText>{getTabulatedCategory(subType)}</NotionText>,
	];

	return (
		<>
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
		</>
	);
}
