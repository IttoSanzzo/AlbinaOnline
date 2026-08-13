export enum SizeClass {
	Unknown,

	Minuscule, // <= 5cm
	Tiny, // <= 15cm
	Miniature, // <= 25cm
	Small, // <= 50cm
	Lesser, // <= 1m
	Medium, // <= 2m
	Large, // <= 4m
	Huge, // <= 8m
	Gigantic, // <= 16m
	Colossal, // <= 32m
	Titanic, // <= 64m
	Monumental, // <= 100m
	Transcendent, // > 100m
}

export const SizeClassMasculineName: Record<keyof typeof SizeClass, string> = {
	Unknown: "Desconhecido",
	Minuscule: "Minúsculo",
	Tiny: "Ínfimo",
	Miniature: "Diminuto",
	Small: "Pequeno",
	Lesser: "Menor",
	Medium: "Médio",
	Large: "Grande",
	Huge: "Enorme",
	Gigantic: "Gigantesco",
	Colossal: "Colossal",
	Titanic: "Titânico",
	Monumental: "Monumental",
	Transcendent: "Transcendente",
};
