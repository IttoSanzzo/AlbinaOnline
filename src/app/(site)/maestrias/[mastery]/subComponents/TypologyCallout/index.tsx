import { NotionCallout, NotionTable } from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "proficiency":
			return ["💮Proficiência", "🌟"];
		case "expertise":
			return ["💮Perícia", "🪡"];
		case "knowledge":
			return ["💮Conhecimento", "📖"];
		case "craft":
			return ["💮Ofício", "👜"];
		default:
			return ["Unknown", "?"];
	}
}
function getTabulatedStatus(status: string) {
	switch (status) {
		case "agility":
			return ["🦵🏻⸙Agilidade⸙", "⊱🦵🏻"];
		case "intelligence":
			return ["🧠⸙Inteligência⸙", "⊱🧠"];
		case "strenght":
			return ["💪🏻⸙Força⸙", "⊱💪🏻"];
		case "constitution":
			return ["⊱🍻⸙Constituição⸙", "⊱🍻"];
		case "technique":
			return ["🤏🏻⸙Técnica⸙", "⊱🤏🏻"];
		case "charisma":
			return ["🎭⸙Carisma⸙", "⊱🎭"];
		case "wisdom":
			return ["🧙🏻‍♂️⸙Sabedoria⸙", "⊱🧙🏻‍♂️"];
		case "singular":
			return ["📘⸙Singular⸙", "⊱📘"];
		case "multiple":
			return ["📚⸙Múltiplo⸙", "⊱📚"];
		case "general":
			return ["👔⸙Geral⸙", "⊱👔"];
		case "combatant":
			return ["🥋⸙Combatente⸙", "⊱🥋"];
		case "production":
			return ["🥽⸙Produção⸙", "⊱🥽"];
		case "armed":
			return ["⚔️⸙Armada⸙", "⊱⚔️"];
		case "armored":
			return ["🛡️⸙Defensiva⸙", "⊱🛡️"];
		case "focus":
			return ["🪄⸙Foco⸙", "⊱🪄"];
		case "combatStyle":
			return ["⊱🎖️⸙Estilo de Combate⸙", "⊱🎖️"];
		case "tool":
			return ["🛠️⸙Ferramenta⸙", "⊱🛠️"];
		default:
			return ["Unknown", "?"];
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
	const tableType = getTabulatedType(type);
	const tableStatus = getTabulatedStatus(category);

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
