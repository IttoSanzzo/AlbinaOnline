export interface Alignment {
	ethic: keyof typeof EthicAlignment;
	moral: keyof typeof MoralAlignment;
}

export enum EthicAlignment {
	Unknown,

	Lawful,
	Neutral,
	Chaotic,
}
export enum MoralAlignment {
	Unknown,

	Good,
	Neutral,
	Evil,
}
