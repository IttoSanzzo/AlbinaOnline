import { LintIgnoredAny } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { ReactNode } from "react";

export const DEFAULT_CORE_DIAMETER = 180;
export const DEFAULT_RING_WIDTH = 80;
export const RING_GAP = 3;
export const MIN_OPTIONS_PER_RING = 2;
export const ACTIVE_EXPANSION = 8;
export const RADIAL_START_ANGLE = -Math.PI / 2;

export interface RadialMenuOption {
	id: string;
	name?: string;
	data?: LintIgnoredAny;
	icon: ReactNode;
	description?: string;
	backgroundColor?: string;
	nameColor?: string;
	showName?: boolean;
	options?: RadialMenuOption[];
	fastKey?: string;
}

export interface RadialMenuCoreGeneratorProps {
	cursorPosition: CoordinatePair;
	option?: RadialMenuOption;
}

export interface RadialMenuSubmitProps {
	option: RadialMenuOption;
	depth: number;
	timestamp: number;
	cursorPosition: CoordinatePair;
	close: () => void;
}

export interface RadialMenuRing {
	options: RadialMenuOption[];
	depth: number;
	parentOptionId?: string;
}

export interface RadialMenuRingGeometry extends RadialMenuRing {
	width: number;
	innerRadius: number;
	outerRadius: number;
}
