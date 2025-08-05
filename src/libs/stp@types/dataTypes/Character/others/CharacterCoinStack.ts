export enum MonetaryUnit {
	Unknown,
	Koryn,
	Lyur,
	Perck,
	Varis,
}
export type PerckCoins = null;
export type VarisCoins = null;
export type KorynCoins = {
	$type: "KorynCoins";
	copperSmall: number;
	copperLarge: number;
	silverSmall: number;
	silverLarge: number;
	goldSmall: number;
	goldLarge: number;
	platinum: number;
	iridium: number;
	obsidian: number;
	emerald: number;
	diamond: number;
};
export type LyurCoins = {
	$type: "LyurCoins";
	lyur: number;
};
export type CharacterCoinStack = {
	id: string;
	characterId: string;
	type: "Character";
	unit: keyof typeof MonetaryUnit;
	coins: KorynCoins | LyurCoins | VarisCoins | PerckCoins;
};
