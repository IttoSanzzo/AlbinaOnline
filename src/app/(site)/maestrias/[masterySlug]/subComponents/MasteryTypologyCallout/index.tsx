import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "proficiency":
			return "🌟[@/[Proficiências]maestrias#proficiencias]";
		case "expertise":
			return "🪡[@/[Perícias]maestrias#pericias]";
		case "knowledge":
			return "📖[@/[Conhecimentos]maestrias#conhecimentos]";
		case "craft":
			return "👜[@/[Ofícios]maestrias#oficios]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(category: string) {
	switch (category) {
		case "agility":
			return "⊱🦵🏻⸙Agilidade⸙";
		case "intelligence":
			return "⊱🧠⸙Inteligência⸙";
		case "strength":
			return "⊱💪🏻⸙Força⸙";
		case "constitution":
			return "⊱🍻⸙Constituição⸙";
		case "technique":
			return "⊱🤏🏻⸙Técnica⸙";
		case "charisma":
			return "⊱🎭⸙Carisma⸙";
		case "wisdom":
			return "⊱🧙🏻‍♂️⸙Sabedoria⸙";
		case "singular":
			return "⊱📘⸙Singular⸙";
		case "multiple":
			return "⊱📚⸙Múltiplo⸙";
		case "general":
			return "⊱👔⸙Geral⸙";
		case "combatant":
			return "⊱🥋⸙Combatente⸙";
		case "production":
			return "⊱🥽⸙Produção⸙";
		case "armed":
			return "⊱⚔️⸙Armada⸙";
		case "armored":
			return "⊱🛡️⸙Defensiva⸙";
		case "focus":
			return "⊱🪄⸙Foco⸙";
		case "combatStyle":
			return "⊱🎖️⸙Estilo de Combate⸙";
		case "tool":
			return "⊱🛠️⸙Ferramenta⸙";
		default:
			return "⊱Unknown?";
	}
}

interface MasteryTypologyCalloutProps {
	type: string;
	category: string;
}
export default function MasteryTypologyCallout({
	type,
	category,
}: MasteryTypologyCalloutProps) {
	const tableType = [
		"💮Tipo",
		<NotionText>{getTabulatedType(type)}</NotionText>,
	];
	const tableStatus = [
		"🏷️Categoria",
		<NotionText>{getTabulatedCategory(category)}</NotionText>,
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
