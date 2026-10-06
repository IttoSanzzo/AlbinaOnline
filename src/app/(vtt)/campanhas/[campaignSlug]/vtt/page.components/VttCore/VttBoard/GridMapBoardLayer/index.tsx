import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo, useEffect, useState } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { GridMapsModal } from "@/app/(site)/atlas/page.components/GridMapsModal";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { VttGridMapElement } from "./VttGridMapElement";
import { Guid } from "@/libs/stp@types";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";

const GridMapBoardLayerContainer = newStyledElement.div(
	styles.gridMapBoardLayerContainer,
);

export const GridMapBoardLayer = memo(function GridMapBoardLayer() {
	const { activeLayer } = useVttBoardLayerContext();
	const { camera, worldToScreen, viewport } =
		useVttThrottledViewportContext(100);
	const { subscribe } = useVttContext();
	const [vttGridMaps, setVttGridMaps] = useState<VttGridMap[]>([]);

	useEffect(() => {
		const unsubscribe1 = subscribe("VttCompleteSceneSnapshot", (event) => {
			setVttGridMaps((event.data as { gridMaps: VttGridMap[] }).gridMaps);
		});
		const unsubscribe2 = subscribe("VttGridMapAdded", (event) => {
			setVttGridMaps((state) => [
				...state,
				(event.data as { vttGridMap: VttGridMap }).vttGridMap,
			]);
		});
		const unsubscribe3 = subscribe("VttGridMapUpdated", (event) => {
			const vttGridMap = (event.data as { vttGridMap: VttGridMap }).vttGridMap;
			setVttGridMaps((state) => [
				...state.filter((entity) => entity.id != vttGridMap.id),
				vttGridMap,
			]);
		});
		const unsubscribe4 = subscribe("VttGridMapRemoved", (event) => {
			const vttGridMapId = (event.data as { vttGridMapId: Guid }).vttGridMapId;
			setVttGridMaps((state) => [
				...state.filter((entity) => entity.id != vttGridMapId),
			]);
		});
		return () => {
			unsubscribe1();
			unsubscribe2();
			unsubscribe3();
			unsubscribe4();
		};
	}, [subscribe]);

	return (
		<GridMapBoardLayerContainer>
			{vttGridMaps.map((vttGridMap) => {
				const coordinates = worldToScreen(vttGridMap.coordinates);
				const x =
					coordinates.x -
					vttGridMap.gridMap.offsetX * PIXELS_PER_CENTIMETER * camera.zoom;
				const y =
					coordinates.y -
					vttGridMap.gridMap.offsetY * PIXELS_PER_CENTIMETER * camera.zoom;
				const width =
					vttGridMap.gridMap.width * PIXELS_PER_CENTIMETER * camera.zoom;
				const height =
					vttGridMap.gridMap.height * PIXELS_PER_CENTIMETER * camera.zoom;

				const isVisible =
					x + width >= 0 &&
					y + height >= 0 &&
					x <= viewport.width &&
					y <= viewport.height;

				if (!isVisible) return null;

				return (
					<VttGridMapElement
						key={vttGridMap.id}
						vttGridMap={vttGridMap}
					/>
				);
			})}
			{activeLayer == VttBoardLayer.GridMap && <GridMapsModal isInVtt />}
		</GridMapBoardLayerContainer>
	);
});
