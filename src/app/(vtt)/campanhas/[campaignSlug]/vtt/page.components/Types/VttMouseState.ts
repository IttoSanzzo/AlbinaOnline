export interface VttMouseState {
	type: VttInteractionType;
	color1: string;
	color2: string;
	x: number;
	y: number;
}

export type VttInteractionType =
	| "Default"
	| "DefaultUp"
	| "Pointer"
	| "Brush"
	| "Menu"
	| "Chat"
	| "Hand"
	| "Move"
	| "Eraser"
	| "Measuring";
