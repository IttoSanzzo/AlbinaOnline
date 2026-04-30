import { UIBasics } from "@/components/(UIBasics)";
import { ItemSubType, ItemType } from "@/libs/stp@types";

function getTabulatedType(type: keyof typeof ItemType) {
	switch (type) {
		case "Armament":
			return "[@/[Armamento]items#armamentos]";
		case "Focus":
			return "[@/[Focus]items#focus]";
		case "Shielding":
			return "[@/[Escudo]items#escudos]";
		case "Frame":
			return "[@/[Frame]items#frames]";
		case "Wearable":
			return "[@/[Vestimenta Auxiliar]items#vestimentas-auxiliares]";
		case "Accessory":
			return "[@/[Acessório]items#acessorios]";
		case "Consumable":
			return "[@/[Consumível]items#consumiveis]";
		case "Special":
			return "[@/[Especial]items#especiais]";
		case "Miscellaneous":
			return "[@/[Miscelâneo]items#miscelâneos]";
		case "Tool":
			return "[@/[Ferramenta]items#ferramentas]";
		case "Kit":
			return "[@/[Kit]items#kits]";
		case "Vehicle":
			return "[@/[Veículo]items#veiculos]";
		case "Random":
			return "[@/[Aleatório]items#aleatorios]";
		case "Unknown":
		default:
			return "[@/[Unknown]items]";
	}
}
function getTabulatedCategory(subType: keyof typeof ItemSubType) {
	switch (subType) {
		case "Grimoire":
			return "[@/[Grimório]items]";
		case "Staff":
			return "[@/[Cajado]items]";
		case "Scepter":
			return "[@/[Cetro]items]";
		case "Wand":
			return "[@/[Varinha]items]";
		case "Orb":
			return "[@/[Orbe]items]";
		case "ShortBlade":
			return "[@/[Lâmina Pequena]items]";
		case "Sword":
			return "[@/[Espada]items]";
		case "Axe":
			return "[@/[Machado]items]";
		case "Bow":
			return "[@/[Arco]items]";
		case "Crossbow":
			return "[@/[Besta]items]";
		case "Polearm":
			return "[@/[Arma de Haste]items]";
		case "ConcussiveWeapon":
			return "[@/[Arma de Concussão]items]";
		case "FireWeapon":
			return "[@/[Arma de Fogo]items]";
		case "TetheredWeapon":
			return "[@/[Arma Flexível]items]";
		case "BluntWeapon":
			return "[@/[Arma Cega]items]";
		case "LightShield":
			return "[@/[Escudo Leve]items]";
		case "MediumShield":
			return "[@/[Escudo Médio]items]";
		case "HeavyShield":
			return "[@/[Escudo Pesado]items]";
		case "LightFrame":
			return "[@/[Frame Leve]items]";
		case "MediumFrame":
			return "[@/[Frame Médio]items]";
		case "HeavyFrame":
			return "[@/[Frame Pesado]items]";
		case "Amulet":
			return "[@/[Amuleto]items]";
		case "Catalyst":
			return "[@/[Catalisador]items]";
		case "Charm":
			return "[@/[Talismã]items]";
		case "Codex":
			return "[@/[Codex]items]";
		case "Container":
			return "[@/[Container]items]";
		case "Food":
			return "[@/[Comida]items]";
		case "Key":
			return "[@/[Chave]items]";
		case "Material":
			return "[@/[Material]items]";
		case "Potion":
			return "[@/[Poção]items]";
		case "Relic":
			return "[@/[Relíquia]items]";
		case "Ring":
			return "[@/[Anel]items]";
		case "Scroll":
			return "[@/[Scroll]items]";
		case "ThrownWeapon":
			return "[@/[Arma de Arremesso]items]";
		case "Tool":
			return "[@/[Ferramenta]items]";
		case "Toy":
			return "[@/[Brinquedo]items]";
		case "Terrestrial":
			return "[@/[Terrestre]items]";
		case "Aquatic":
			return "[@/[Aquático]items]";
		case "Aerial":
			return "[@/[Aéreo]items]";
		case "Random":
			return "[@/[Aleatório]items]";
		case "Unknown":
		default:
			return "[@/[Unknown]items]";
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
