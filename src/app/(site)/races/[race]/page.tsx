import { RaceContainer } from "./styledComponents";

interface RaceData {
	name: string;
}

interface RaceProps {
	params: Promise<{ race: string }>;
}

export default async function Race({ params }: RaceProps) {
	const { race } = await params;

	return <RaceContainer>{race}</RaceContainer>;
}

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	return [
		{ race: "humano" },
		{ race: "bestial" },
		{ race: "pequenino" },
		{ race: "dwarf" },
		{ race: "halbelf" },
		{ race: "maketsu" },
		{ race: "alarion" },
		{ race: "draknir" },
		{ race: "fada" },
		{ race: "hochelf" },
		{ race: "mondelf" },
		{ race: "sonnelf" },
		{ race: "dokkalfar" },
		{ race: "waldelf" },
		{ race: "zwergelf" },
		{ race: "faedra" },
		{ race: "tita" },
		{ race: "troll" },
		{ race: "dragao-verdadeiro" },
		{ race: "wyvern" },
		{ race: "wyrm" },
		{ race: "drake" },
		{ race: "draconato" },
		{ race: "demonio-puro" },
		{ race: "ogro" },
		{ race: "oni" },
		{ race: "imp" },
		{ race: "nephilim" },
		{ race: "anjo-puro" },
		{ race: "platenario" },
		{ race: "empirico" },
		{ race: "ljosalfar" },
		{ race: "sishen" },
		{ race: "deva" },
		{ race: "licht" },
		{ race: "kiishu" },
		{ race: "fitopheles" },
		{ race: "demen" },
		{ race: "seirei" },
		{ race: "driade" },
		{ race: "feral" },
		{ race: "nezhit" },
		{ race: "vampiro-verdadeiro" },
		{ race: "espectro" },
		{ race: "takroiy" },
		{ race: "nekri" },
		{ race: "lich" },
		{ race: "goblin" },
	];
}
