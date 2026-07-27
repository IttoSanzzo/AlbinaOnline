export enum WorldPlane {
	Unknown,
	Original,
	Orvanis,
	Feenwelt,
	Himmel,
	Inanis,

	NotAligned,
	External,
	Pocket,
}

export const WorldPlaneName: Record<keyof typeof WorldPlane, string> = {
	Original: "Original",
	Orvanis: "Orvanis",
	Feenwelt: "Feenwelt",
	Himmel: "Himmel",
	Inanis: "Inanis",
	NotAligned: "Desalinhado",
	External: "Externo",
	Pocket: "Bolso",
	Unknown: "?",
};
