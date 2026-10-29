import { DEFAULT_GRID_CELL_SIZE } from "../../../Contexts/VttGridProvider";
import { VttResourceDragSnap } from "../../../Hooks/useVttResourceDrag";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";

interface TransformedGridMapGeometry {
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
}
export function getTransformedGridMapGeometry(
	width: number,
	height: number,
	offsetX: number,
	offsetY: number,
	rotation: number,
	horizontalMirror: boolean,
	verticalMirror: boolean,
): TransformedGridMapGeometry {
	const radians = (rotation * Math.PI) / 180;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);
	const scaleX = horizontalMirror ? -1 : 1;
	const scaleY = verticalMirror ? -1 : 1;

	function transformPoint(x: number, y: number) {
		const mirroredX = x * scaleX;
		const mirroredY = y * scaleY;

		return {
			x: mirroredX * cos - mirroredY * sin,
			y: mirroredX * sin + mirroredY * cos,
		};
	}

	const halfWidth = width / 2;
	const halfHeight = height / 2;

	const corners = [
		transformPoint(-halfWidth, -halfHeight),
		transformPoint(halfWidth, -halfHeight),
		transformPoint(halfWidth, halfHeight),
		transformPoint(-halfWidth, halfHeight),
	];

	const minX = Math.min(...corners.map((point) => point.x));
	const maxX = Math.max(...corners.map((point) => point.x));
	const minY = Math.min(...corners.map((point) => point.y));
	const maxY = Math.max(...corners.map((point) => point.y));

	const transformedOffset = transformPoint(
		offsetX - halfWidth,
		offsetY - halfHeight,
	);

	function clean(value: number) {
		const rounded = Math.round(value);
		return Math.abs(value - rounded) < 1e-8 ? rounded : value;
	}

	return {
		width: clean(maxX - minX),
		height: clean(maxY - minY),
		offsetX: clean(transformedOffset.x - minX),
		offsetY: clean(transformedOffset.y - minY),
	};
}
export function getGridMapSnap(
	gridMap: VttGridMap["gridMap"],
	rotation: number,
	horizontalMirror: boolean,
	verticalMirror: boolean,
): VttResourceDragSnap {
	const geometry = getTransformedGridMapGeometry(
		gridMap.width,
		gridMap.height,
		gridMap.offsetX,
		gridMap.offsetY,
		rotation,
		horizontalMirror,
		verticalMirror,
	);

	return {
		type: "centered",
		cellSize: DEFAULT_GRID_CELL_SIZE,
		width: geometry.width,
		height: geometry.height,
		offsetX: geometry.offsetX,
		offsetY: geometry.offsetY,
	};
}
