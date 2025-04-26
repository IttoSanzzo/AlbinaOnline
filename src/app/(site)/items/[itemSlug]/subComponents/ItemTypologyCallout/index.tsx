import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "armament":
			return "🌟[@/[Armamento]items#armamentos]";
		case "focus":
			return "🌟[@/[Focus]items#focus]";
		case "shielding":
			return "🌟[@/[Escudo]items#escudos]";
		case "frame":
			return "🌟[@/[Frame]items#frames]";
		case "wearable":
			return "🌟[@/[Vestimenta Auxiliar]items#vestimentas-auxiliares]";
		case "accessory":
			return "🌟[@/[Acessório]items#acessorios]";
		case "consumable":
			return "🌟[@/[Consumível]items#consumiveis]";
		case "special":
			return "🌟[@/[Especial]items#especiais]";
		case "miscellaneous":
			return "🌟[@/[Miscelâneo]items#miscelâneos]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(subType: string) {
	switch (subType) {
		case "grimoire":
			return "⊱⸙Grimório⸙";
		case "staff":
			return "⊱⸙Cajado⸙";
		case "Scepter":
			return "⊱⸙Cetro⸙";
		case "wand":
			return "⊱⸙Varinha⸙";
		case "orb":
			return "⊱⸙Orbe⸙";
		case "shortBlade":
			return "⊱⸙Lâmina Pequena⸙";
		case "sword":
			return "⊱⸙Espada⸙";
		case "axe":
			return "⊱⸙Machado⸙";
		case "bow":
			return "⊱⸙Arco⸙";
		case "crossbow":
			return "⊱⸙Besta⸙";
		case "polearm":
			return "⊱⸙Arma de Haste⸙";
		case "concussiveWeapon":
			return "⊱⸙Arma de Concussão⸙";
		case "fireWeapon":
			return "⊱⸙Arma de Fogo⸙";
		case "Tethered Weapon":
			return "⊱⸙Arma Flexível⸙";
		case "bluntWeapon":
			return "⊱⸙Arma Cega⸙";
		case "lightShield":
			return "⊱⸙Escudo Leve⸙";
		case "mediumShield":
			return "⊱⸙Escudo Médio⸙";
		case "heavyShield":
			return "⊱⸙Escudo Pesado⸙";
		case "lightFrame":
			return "⊱⸙Frame Leve⸙";
		case "mediumFrame":
			return "⊱⸙Frame Médio⸙";
		case "heavyFrame":
			return "⊱⸙Frame Pesado⸙";
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
