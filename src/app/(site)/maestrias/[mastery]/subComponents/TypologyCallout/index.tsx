import { NotionCallout, NotionTable } from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "expertise":
			return ["💮Perícia", "🪡"];
			break;
		case "knowledge":
			return ["💮Conhecimento", "📖"];
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
			break;
		case "intelligence":
			return ["🧠⸙Inteligência⸙", "⊱🧠"];
			break;
		case "strenght":
			return ["💪🏻⸙Força⸙", "⊱💪🏻"];
			break;
		case "constitution":
			return ["⊱🍻⸙Constituição⸙", "⊱🍻"];
			break;
		case "technique":
			return ["🤏🏻⸙Técnica⸙", "⊱🤏🏻"];
			break;
		case "charisma":
			return ["🎭⸙Carisma⸙", "⊱🎭"];
			break;
		case "wisdom":
			return ["🧙🏻‍♂️⸙Sabedoria⸙", "⊱🧙🏻‍♂️"];
			break;
		case "singular":
			return ["📘⸙Singular⸙", "⊱📘"];
			break;
		case "multiple":
			return ["⊱📚⸙Múltiplo⸙", "⊱⊱📚"];
			break;
		default:
			return ["Unknown", "?"];
			break;
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
