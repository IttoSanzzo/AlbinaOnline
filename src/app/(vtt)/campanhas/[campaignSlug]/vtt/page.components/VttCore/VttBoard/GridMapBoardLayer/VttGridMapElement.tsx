"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttGridMapElement.module.css";
import { useEffect, useMemo, useRef } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { BasicMedia } from "@/components/(Design)/components/BasicMedia";
import { useRadialMenuActions } from "@/components/(SPECIAL)/components/RadialMenu/Context";

import { Guid } from "@/libs/stp@types";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import { useVttResourceDrag } from "../../../Hooks/useVttResourceDrag";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VTTGRIDMAP_RENDER_THROTTLE } from "./VttGridMapElementWrapper";
import { openVttGridMapRadialMenu } from "./VttGridMapElement.RadialMenu";
import { getGridMapSnap } from "./VttGridMapElement.utils";
import { usePointerInteractionEvents } from "@/libs/stp@hooks/hooks/usePointerInteractionEvents";
import clsx from "clsx";

const VttGridMapElementContainer = newStyledElement.div(
	styles.vttGridMapElementContainer,
);
const VttGridMapCoordinateIndicator = newStyledElement.div(
	styles.vttGridMapCoordinateIndicator,
);

interface VttGridMapElementProps {
	vttGridMap: VttGridMap;
}
export function VttGridMapElement({ vttGridMap }: VttGridMapElementProps) {
	const { openNew: openNewRadialMenu } = useRadialMenuActions();
	const isActiveLayer = useVttBoardLayerContext((state) =>
		state.isLayerActive(VttBoardLayer.GridMap),
	);
	const send = useVttContext((state) => state.send);
	const subscribe = useVttContext((state) => state.subscribe);
	const worldToScreen = useVttThrottledViewportContext(
		(state) => state.worldToScreen,
		VTTGRIDMAP_RENDER_THROTTLE,
	);
	const pixelScale = useVttThrottledViewportContext(
		(state) => state.pixelScale,
		VTTGRIDMAP_RENDER_THROTTLE,
	);
	useVttThrottledViewportContext(
		(state) => state.camera,
		VTTGRIDMAP_RENDER_THROTTLE,
	);
	const vttGridMapRef = useRef(vttGridMap);
	vttGridMapRef.current = vttGridMap;

	const gridMap = vttGridMap.gridMap;
	const transform = vttGridMap.transform;
	const dragResourceLock = vttGridMap.resourceLocks.find(
		(lock) => lock.lockType == "drag",
	);

	const drag = useVttResourceDrag({
		coordinates: vttGridMap.coordinates,
		resourceLock: dragResourceLock,
		enabled: isActiveLayer,
		snap: useMemo(
			() =>
				getGridMapSnap(
					gridMap,
					transform.rotation,
					transform.horizontalMirror,
					transform.verticalMirror,
				),
			[
				gridMap.width,
				gridMap.height,
				gridMap.offsetX,
				gridMap.offsetY,
				transform.rotation,
				transform.horizontalMirror,
				transform.verticalMirror,
			],
		),
		onDragStart: () => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Post",
				data: {
					vttGridMapId: vttGridMapRef.current.id,
				},
			});
		},
		onDragUpdate: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Patch",
				data: {
					vttGridMapId: vttGridMapRef.current.id,
					coordinates,
				},
			});
		},
		onDragEnd: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps/drag",
				method: "Put",
				data: {
					vttGridMapId: vttGridMapRef.current.id,
					coordinates,
				},
			});
		},
	});

	const pointerInteraction = usePointerInteractionEvents({
		onRightPress: () => {
			openVttGridMapRadialMenu(
				vttGridMapRef,
				send,
				openNewRadialMenu,
				drag.snapCoordinates,
			);
		},
	});

	useEffect(() => {
		return subscribe("VttGridMapDragCanceled", (event) => {
			const payload = event.data as {
				vttGridMapId: Guid;
			};
			if (payload.vttGridMapId != vttGridMapRef.current.id) return;
			drag.cancel();
		});
	}, [subscribe, drag.cancel]);

	const position = worldToScreen(drag.coordinates);
	const width = gridMap.width * pixelScale;
	const height = gridMap.height * pixelScale;
	const left = position.x - width / 2;
	const top = position.y - height / 2;

	return (
		<>
			<VttGridMapElementContainer
				{...setVttElementDataAttributes(
					VttElementDataAttribute.EventPing,
					VttElementDataAttribute.EventZoom,
					VttElementDataAttribute.EventMiddleButtonPan,
				)}
				className={clsx(
					isActiveLayer ? styles.activeLayer : undefined,
					drag.isDragging ? styles.isDragging : undefined,
				)}
				style={{
					left,
					top,
					width,
					height,
					rotate: `${transform.rotation}deg`,
					scale: `${transform.horizontalMirror ? -1 : 1} ${transform.verticalMirror ? -1 : 1}`,
					touchAction: "none",
					...(dragResourceLock
						? drag.isLocalDragging
							? { outlineColor: "blue", zIndex: 10000 }
							: { outlineColor: "yellow", zIndex: 9999 }
						: undefined),
				}}
				onPointerDown={(event) => {
					pointerInteraction.onPointerDown(event);
					drag.onPointerDown(event);
				}}
				onPointerMove={(event) => {
					pointerInteraction.onPointerMove(event);
					drag.onPointerMove(event);
				}}
				onPointerUp={(event) => {
					pointerInteraction.onPointerUp(event);
					drag.onPointerUp(event);
				}}
				onPointerCancel={(event) => {
					pointerInteraction.onPointerCancel(event);
				}}
				onContextMenu={(event) => event.preventDefault()}>
				<BasicMedia
					src={gridMap.imageUrl}
					alt={gridMap.name}
					className={styles.media}
					fill
					style={{
						pointerEvents: "none",
						opacity: transform.opacity / 100,
					}}
				/>
			</VttGridMapElementContainer>
			{isActiveLayer && (
				<VttGridMapCoordinateIndicator
					style={{
						left: position.x,
						top: position.y,
						...(dragResourceLock
							? drag.isLocalDragging
								? { outlineColor: "blue", zIndex: 10000 }
								: { outlineColor: "yellow", zIndex: 9999 }
							: undefined),
					}}
				/>
			)}
		</>
	);
}
