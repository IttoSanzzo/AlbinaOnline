import { Guid } from "@/libs/stp@types";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { useVttGridMapStore } from "../../../Stores/VttGridMapStore";
import { VttGridMapElement } from "./VttGridMapElement";
import { memo } from "react";

export const VTTGRIDMAP_RENDER_THROTTLE = 5;

interface VttGridMapElementWrapperProps {
	vttGridMapId: Guid;
}
export const VttGridMapElementWrapper = memo(function VttGridMapElementWrapper({
	vttGridMapId,
}: VttGridMapElementWrapperProps) {
	const isVisible = useVttThrottledViewportContext(
		(state) => state.isVisible,
		VTTGRIDMAP_RENDER_THROTTLE,
	);
	useVttThrottledViewportContext(
		(state) => state.camera,
		VTTGRIDMAP_RENDER_THROTTLE,
	);
	const vttGridMap = useVttGridMapStore((state) =>
		state.gridMaps.get(vttGridMapId),
	);
	if (
		!vttGridMap ||
		!isVisible(
			{
				...vttGridMap.coordinates,
				width: vttGridMap.gridMap.width,
				height: vttGridMap.gridMap.height,
			},
			"partial-extra",
		)
	)
		return null;

	return <VttGridMapElement vttGridMap={vttGridMap} />;
});
