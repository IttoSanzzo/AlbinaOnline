import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttTokenAppearance } from "../../../Types/Classes/VttToken";

function snapTokenAxis(coordinate: number, size: number): number {
	if (size <= 100) {
		const windowSize = size <= 25 ? 25 : size <= 50 ? 50 : 100;
		const step = windowSize === 100 ? 100 : 25;
		const windowStart = Math.floor(coordinate / step) * step;

		return Math.max(
			windowStart + size / 2,
			Math.min(coordinate, windowStart + windowSize - size / 2),
		);
	}

	const cellCount = Math.ceil(size / 100);
	const areaSize = cellCount * 100;

	return Math.round((coordinate - areaSize / 2) / 100) * 100 + areaSize / 2;
}

export function getVttTokenSnap(
	appearance: VttTokenAppearance,
): (coordinates: CoordinatePair) => CoordinatePair {
	const radians = (appearance.rotation * Math.PI) / 180;
	const cos = Math.abs(Math.cos(radians));
	const sin = Math.abs(Math.sin(radians));

	const width = appearance.width * cos + appearance.height * sin;
	const height = appearance.width * sin + appearance.height * cos;

	return (coordinates) => ({
		x: snapTokenAxis(coordinates.x, width),
		y: snapTokenAxis(coordinates.y, height),
	});
}
