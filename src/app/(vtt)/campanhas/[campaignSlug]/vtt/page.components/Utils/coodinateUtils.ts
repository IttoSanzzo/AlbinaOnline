import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";

export function roundCoordinate(coordinate: CoordinatePair): CoordinatePair {
	return {
		x: Math.round(coordinate.x),
		y: Math.round(coordinate.y),
	};
}
