export enum LifeState {
	Unknown,

	Inanimate,
	Dead,
	Alive,
	Artificial,
	Undead,
	Immortal,
	Eternal,
	Corrupted,
}

export const LifeStateName: Record<keyof typeof LifeState, string> = {
	Unknown: "Desconhecido",
	Inanimate: "Inanimado",
	Dead: "Morto",
	Alive: "Vivo",
	Artificial: "Artificial",
	Undead: "Não-Morto",
	Immortal: "Imortal",
	Eternal: "Eterno",
	Corrupted: "Corrompido",
};
