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
	const [vttGridMaps, setVttGridMaps] = useState<Map<Guid, VttGridMap>>(
		new Map<Guid, VttGridMap>(),
	);
	const [vttGridMapOrder, setVttGridMapOrder] = useState<Guid[]>([]);

	useEffect(() => {
		const unsubscribe1 = subscribe("VttCompleteSceneSnapshot", (event) => {
			const payloadVttGridMaps = (
				event.data as { gridMaps: VttGridMap[] }
			).gridMaps.toSorted(
				(a, b) =>
					new Date(a.updatedAt ?? a.createdAt).getTime() -
					new Date(b.updatedAt ?? b.createdAt).getTime(),
			);
			setVttGridMapOrder(payloadVttGridMaps.map((vttGridMap) => vttGridMap.id));
			setVttGridMaps(
				new Map<Guid, VttGridMap>(
					payloadVttGridMaps.map((vttGridMap) => [vttGridMap.id, vttGridMap]),
				),
			);
		});
		const unsubscribe2 = subscribe("VttGridMapAdded", (event) => {
			const vttGridMap = (event.data as { vttGridMap: VttGridMap }).vttGridMap;
			setVttGridMaps((state) => {
				const next = new Map(state);
				next.set(vttGridMap.id, vttGridMap);
				return next;
			});
			setVttGridMapOrder((state) => [...state, vttGridMap.id]);
		});
		const unsubscribe3 = subscribe("VttGridMapUpdated", (event) => {
			const vttGridMap = (event.data as { vttGridMap: VttGridMap }).vttGridMap;
			setVttGridMaps((state) => {
				const next = new Map(state);
				next.set(vttGridMap.id, vttGridMap);
				return next;
			});
		});
		const unsubscribe4 = subscribe("VttGridMapRemoved", (event) => {
			const vttGridMapId = (event.data as { vttGridMapId: Guid }).vttGridMapId;
			setVttGridMaps((state) => {
				const next = new Map(state);
				next.delete(vttGridMapId);
				return next;
			});
			setVttGridMapOrder((state) => state.filter((id) => id != vttGridMapId));
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
			{vttGridMapOrder.map((id) => {
				const vttGridMap = vttGridMaps.get(id);
				if (!vttGridMap) return null;
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
