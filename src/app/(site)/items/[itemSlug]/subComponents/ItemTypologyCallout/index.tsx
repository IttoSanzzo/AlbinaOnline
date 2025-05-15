import {
	NotionCallout,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";

function getTabulatedType(type: string) {
	switch (type) {
		case "Armament":
			return "🌟[@/[Armamento]items#armamentos]";
		case "Focus":
			return "🌟[@/[Focus]items#focus]";
		case "Shielding":
			return "🌟[@/[Escudo]items#escudos]";
		case "Frame":
			return "🌟[@/[Frame]items#frames]";
		case "Wearable":
			return "🌟[@/[Vestimenta Auxiliar]items#vestimentas-auxiliares]";
		case "Accessory":
			return "🌟[@/[Acessório]items#acessorios]";
		case "Consumable":
			return "🌟[@/[Consumível]items#consumiveis]";
		case "Special":
			return "🌟[@/[Especial]items#especiais]";
		case "Miscellaneous":
			return "🌟[@/[Miscelâneo]items#miscelâneos]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(subType: string) {
	switch (subType) {
		case "Grimoire":
			return "⊱⸙Grimório⸙";
		case "Staff":
			return "⊱⸙Cajado⸙";
		case "Scepter":
			return "⊱⸙Cetro⸙";
		case "Wand":
			return "⊱⸙Varinha⸙";
		case "Orb":
			return "⊱⸙Orbe⸙";
		case "ShortBlade":
			return "⊱⸙Lâmina Pequena⸙";
		case "Sword":
			return "⊱⸙Espada⸙";
		case "Axe":
			return "⊱⸙Machado⸙";
		case "Bow":
			return "⊱⸙Arco⸙";
		case "Crossbow":
			return "⊱⸙Besta⸙";
		case "Polearm":
			return "⊱⸙Arma de Haste⸙";
		case "ConcussiveWeapon":
			return "⊱⸙Arma de Concussão⸙";
		case "FireWeapon":
			return "⊱⸙Arma de Fogo⸙";
		case "TetheredWeapon":
			return "⊱⸙Arma Flexível⸙";
		case "BluntWeapon":
			return "⊱⸙Arma Cega⸙";
		case "LightShield":
			return "⊱⸙Escudo Leve⸙";
		case "MediumShield":
			return "⊱⸙Escudo Médio⸙";
		case "HeavyShield":
			return "⊱⸙Escudo Pesado⸙";
		case "LightFrame":
			return "⊱⸙Frame Leve⸙";
		case "MediumFrame":
			return "⊱⸙Frame Médio⸙";
		case "HeavyFrame":
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
