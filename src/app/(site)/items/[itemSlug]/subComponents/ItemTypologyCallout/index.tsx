import { UIBasics } from "@/components/(UIBasics)";
import { ItemSubType, ItemType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof ItemType) {
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
		case "Tool":
			return "🌟[@/[Ferramenta]items#ferramentas]";
		case "Random":
			return "🌟[@/[Aleatório]items#aleatorios]";
		default:
			return "Unknown?";
	}
}
function getTabulatedCategory(subType: keyof typeof ItemSubType) {
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
		case "Amulet":
			return "⊱⸙Amuleto⸙";
		case "Catalyst":
			return "⊱⸙Catalisador⸙";
		case "Charm":
			return "⊱⸙Talismã⸙";
		case "Codex":
			return "⊱⸙Codex⸙";
		case "Container":
			return "⊱⸙Container⸙";
		case "Food":
			return "⊱⸙Comida⸙";
		case "Key":
			return "⊱⸙Chave⸙";
		case "Material":
			return "⊱⸙Material⸙";
		case "Potion":
			return "⊱⸙Poção⸙";
		case "Relic":
			return "⊱⸙Relíquia⸙";
		case "Ring":
			return "⊱⸙Anel⸙";
		case "Scroll":
			return "⊱⸙Scroll⸙";
		case "ThrownWeapon":
			return "⊱⸙Arma de Arremesso⸙";
		case "Tool":
			return "⊱⸙Ferramenta⸙";
		case "Unknown":
			return "⊱⸙Unknown⸙";
		default:
			return "Unknown?";
	}
}

interface ItemTypologyCalloutProps {
	type: keyof typeof ItemType;
	subType: keyof typeof ItemSubType;
}
export default function ItemTypologyCallout({
	type,
	subType,
}: ItemTypologyCalloutProps) {
	const tableType = [
		"💮Tipo",
		<UIBasics.Text>{getTabulatedType(type)}</UIBasics.Text>,
	];
	const tableStatus = [
		"🏷️Sub-Tipo",
		<UIBasics.Text>{getTabulatedCategory(subType)}</UIBasics.Text>,
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
