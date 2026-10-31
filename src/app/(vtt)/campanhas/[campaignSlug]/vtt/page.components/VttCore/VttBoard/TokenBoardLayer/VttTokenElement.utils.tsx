import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttTokenAppearance } from "../../../Types/Classes/VttToken";

function snapTokenAxis(coordinate: number, size: number): number {
	if (size <= 100) {
		const windowSize = size <= 25 ? 25 : size <= 50 ? 50 : 100;
		const step = windowSize === 50 || windowSize === 25 ? 25 : 100;
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
	const rotation = ((appearance.rotation % 360) + 360) % 360;
	const scale = appearance.scale / 100;

	let width: number;
	let height: number;

	switch (rotation) {
		case 0:
		case 180:
			width = appearance.width * scale;
			height = appearance.height * scale;
			break;

		case 90:
		case 270:
			width = appearance.height * scale;
			height = appearance.width * scale;
			break;

		default: {
			const radians = (rotation * Math.PI) / 180;
			const cos = Math.abs(Math.cos(radians));
			const sin = Math.abs(Math.sin(radians));

			width = appearance.width * scale * cos + appearance.height * scale * sin;

			height = appearance.width * scale * sin + appearance.height * scale * cos;
			break;
		}
	}

	return (coordinates) => ({
		x: snapTokenAxis(coordinates.x, width),
		y: snapTokenAxis(coordinates.y, height),
	});
}
