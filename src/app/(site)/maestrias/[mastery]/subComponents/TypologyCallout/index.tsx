import { NotionCallout, NotionTable } from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "expertise":
			return ["💮Perícia", "🪡"];
			break;
		case "knowledge":
			return ["💮Conhecimento", "📖"];
			break;
		case "craft":
			return ["💮Ofício", "👜"];
			break;
		default:
			return ["Unknown", "?"];
			break;
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
		default:
			return ["Unknown", "?"];
	}
}

interface MasteryTypologyCalloutProps {
	type: string;
	status: string;
}
export default function MasteryTypologyCallout({
	type,
	status,
}: MasteryTypologyCalloutProps) {
	const tableType = getTabulatedType(type);
	const tableStatus = getTabulatedStatus(status);

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
