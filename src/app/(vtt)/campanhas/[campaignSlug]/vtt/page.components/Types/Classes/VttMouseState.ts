export interface VttMouseState {
	type: VttCursorInteractionType;
	color1: string;
	color2: string;
	x: number;
	y: number;
}

export const VttCursorInteractionType = {
	Default: "Default",
	DefaultUp: "DefaultUp",
	Pointer: "Pointer",
	Brush: "Brush",
	Menu: "Menu",
	Chat: "Chat",
	Hand: "Hand",
	Move: "Move",
	Eraser: "Eraser",
	Measuring: "Measuring",
	AlignVertical: "AlignVertical",
	AlignHorizontal: "AlignHorizontal",
	Resize: "Resize",
	ResizeVertical: "ResizeVertical",
	ResizeHorizontal: "ResizeHorizontal",
	CornerUpLeft: "CornerUpLeft",
	CameraLens: "CameraLens",
} as const;

export type VttCursorInteractionType =
	(typeof VttCursorInteractionType)[keyof typeof VttCursorInteractionType];

export const horizontalCursorOffset: Record<VttCursorInteractionType, number> =
	{
		Default: 3,
		DefaultUp: 11,
		Pointer: 9,
		Brush: 1,
		Menu: 3,
		Chat: 3,
		Hand: 11,
		Move: 12,
		Eraser: 3,
		Measuring: 4,
		AlignVertical: 12,
		AlignHorizontal: 12,
		ResizeVertical: 12,
		ResizeHorizontal: 12,
		Resize: 12,
		CornerUpLeft: 3,
		CameraLens: 12,
	};
export const verticalCursorOffset: Record<VttCursorInteractionType, number> = {
	Default: 3,
	DefaultUp: 2,
	Pointer: 2,
	Brush: 1,
	Menu: 3,
	Chat: 3,
	Hand: 11,
	Move: 12,
	Eraser: 3,
	Measuring: 4,
	AlignVertical: 12,
	AlignHorizontal: 12,
	ResizeVertical: 12,
	ResizeHorizontal: 12,
	Resize: 12,
	CornerUpLeft: 3,
	CameraLens: 12,
};
