import { GenericInfo, Guid } from "../index";
import { WorldPlane } from "../otherTypes/WorldPlane";
import { LocationLink } from "./locationLink";

export enum LocationType {
	Unknown,
	World,
	Region,
	Nature,
	Settlement,
	District,
	Structure,
	Interior,
	Landmark,
	Plane,
}
export enum LocationSubType {
	Unknown,

	/* World */
	Axis,

	/* Region */
	Continent,
	Archipelago,
	Kingdom,
	Province,

	/* Nature */
	Island,
	Forest,
	WhiteForest,
	Desert,
	Swamp,
	Plains,
	Mountain,
	GreenMountain,
	WhiteMountain,
	BrownMountain,
	Volcano,
	Cave,
	River,
	Lake,

	/* Settlement */
	Metropoly,
	City,
	Village,
	Farm,

	/* District */
	Noble,
	Slum,
	Merchant,
	Military,
	Farmland,

	/* Structure */
	Castle,
	Fortress,
	Outpost,
	Guild,
	Temple,
	Store,
	Shop,
	Bank,
	Library,
	Academy,
	Inn,
	Dungeon,
	Arena,
	Prison,
	Waystation,

	/* Interior */
	Floor,
	Hall,
	Room,

	/* Landmark */
	Monument,
	Ruins,
	Bridge,
	Mine,
	Harbor,
	Portal,
	PointOfInterest,

	/* Plane */
	Pocket,
	Fixed,
}

export type LocationData = {
	id: Guid;
	slug: string;
	name: string;
	type: keyof typeof LocationType;
	subType: keyof typeof LocationSubType;
	worldPlane: keyof typeof WorldPlane;
	info: GenericInfo;
	richInfo?: LocationRichInfo;
	isHidden: boolean;
	childLocationLinks: LocationLink[];
	parentLocationLinks: LocationLink[];
	iconUrl: string;
	bannerUrl: string;
	createdAt: string;
	updatedAt?: string;
	albinaVersion: string;
};

export type LocationRichInfo = {
	climate?: string;
	population?: number;
	government?: string;
	economy?: string;
	currency?: string;
	languages?: string[];
};

export const LocationTypeName: Record<keyof typeof LocationType, string> = {
	World: "Mundo",
	Region: "Região",
	Nature: "Natural",
	Settlement: "Assentamento",
	District: "Distrito",
	Structure: "Estrutura",
	Interior: "Interior",
	Landmark: "Ponto de Referência",
	Plane: "Plano",
	Unknown: "?",
};
export const LocationTypePluralName: Record<keyof typeof LocationType, string> =
	{
		World: "Mundos",
		Region: "Regiões",
		Nature: "Naturais",
		Settlement: "Assentamentos",
		District: "Distritos",
		Structure: "Estruturas",
		Interior: "Interiores",
		Landmark: "Pontos de Referência",
		Plane: "Planos",
		Unknown: "?",
	};

export const LocationSubTypeName: Record<keyof typeof LocationSubType, string> =
	{
		Axis: "Axis",
		Continent: "Continente",
		Archipelago: "Arqupélago",
		Kingdom: "Reino",
		Province: "Província",
		Island: "Ilha",
		Forest: "Floresta",
		WhiteForest: "Floresta",
		Desert: "Deserto",
		Swamp: "Pântano",
		Plains: "Planície",
		Mountain: "Montanha",
		GreenMountain: "Montanha",
		WhiteMountain: "Montanha",
		BrownMountain: "Montanha",
		Volcano: "Vulcão",
		Cave: "Caverna",
		River: "Rio",
		Lake: "Lago",
		Metropoly: "Metrópole",
		City: "Cidade",
		Village: "Vila",
		Farm: "Fazenda",
		Noble: "Nobre",
		Slum: "Favela",
		Merchant: "Mercante",
		Military: "Militar",
		Farmland: "Agrícola",
		Castle: "Castelo",
		Fortress: "Fortaleza",
		Outpost: "Posto Avançado",
		Guild: "Guilda",
		Temple: "Templo",
		Store: "Loja",
		Shop: "Loja",
		Bank: "Banco",
		Library: "Biblioteca",
		Academy: "Academia",
		Inn: "Estalagem",
		Dungeon: "Masmorra",
		Arena: "Arena",
		Prison: "Prisão",
		Waystation: "Ponto de Parada",
		Floor: "Piso",
		Hall: "Salão",
		Room: "Sala",
		Monument: "Monumento",
		Ruins: "Ruína",
		Bridge: "Ponte",
		Mine: "Mina",
		Harbor: "Porto",
		Portal: "Portal",
		PointOfInterest: "Ponto de Interesse",
		Pocket: "Bolso",
		Fixed: "Fixo",
		Unknown: "?",
	};
