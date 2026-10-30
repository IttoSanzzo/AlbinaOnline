import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenElement.module.css";
import {
	VttToken,
	vttTokenCanBeOperatedBy,
	VttTokenPlacement,
} from "../../../Types/Classes/VttToken";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VTTTOKEN_RENDER_THROTTLE } from "./VttTokenElementWrapper";
import { useRadialMenuActions } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { useEffect, useRef } from "react";
import { useVttResourceDrag } from "../../../Hooks/useVttResourceDrag";
import { Guid } from "@/libs/stp@types";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import { useCurrentCampaignMemberStore } from "@/libs/stp@hooks";
import clsx from "clsx";
import { openVttTokenRadialMenu } from "./VttTokenElement.RadialMenu";

const VttTokenElementContainer = newStyledElement.div(
	styles.vttTokenElementContainer,
);

interface VttTokenElementProps {
	vttToken: VttToken;
	placement: VttTokenPlacement;
}
export function VttTokenElement({ vttToken, placement }: VttTokenElementProps) {
	const { openNew: openNewRadialMenu } = useRadialMenuActions();
	const isMaster =
		useCurrentCampaignMemberStore((state) => state.isMaster) ?? false;
	const userId =
		useCurrentCampaignMemberStore((state) => state.member?.userId) ?? null;
	const activeSceneId = useVttContext((store) => store.activeSceneId!);
	const isActiveLayer = useVttBoardLayerContext((state) =>
		state.isLayerActive(VttBoardLayer.Token),
	);
	const send = useVttContext((state) => state.send);
	const subscribe = useVttContext((state) => state.subscribe);
	const worldToScreen = useVttThrottledViewportContext(
		(state) => state.worldToScreen,
		VTTTOKEN_RENDER_THROTTLE,
	);
	const camera = useVttThrottledViewportContext(
		(state) => state.camera,
		VTTTOKEN_RENDER_THROTTLE,
	);
	const vttTokenRef = useRef(vttToken);
	vttTokenRef.current = vttToken;
	const dragResourceLock = vttToken.resourceLocks.find(
		(lock) => lock.lockType == "drag" && lock.sceneId == activeSceneId,
	);

	const isEditable = vttTokenCanBeOperatedBy(vttToken, userId, isMaster);

	const drag = useVttResourceDrag({
		coordinates: placement,
		resourceLock: dragResourceLock,
		enabled: isActiveLayer && isEditable,
		// snap: useMemo(() => undefined, []),
		// () =>
		// 	getTokenSnap(
		// 		gridMap,
		// 		transform.rotation,
		// 		transform.horizontalMirror,
		// 		transform.verticalMirror,
		// 	),
		// [
		// 	gridMap.width,
		// 	gridMap.height,
		// 	gridMap.offsetX,
		// 	gridMap.offsetY,
		// 	transform.rotation,
		// 	transform.horizontalMirror,
		// 	transform.verticalMirror,
		// ],
		onDragStart: () => {
			send({
				id: Guid.NewGuid(),
				path: "/tokens/drag",
				method: "Post",
				data: {
					vttTokenId: vttTokenRef.current.id,
					sceneId: activeSceneId,
				},
			});
		},
		onDragUpdate: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/tokens/drag",
				method: "Patch",
				data: {
					vttTokenId: vttTokenRef.current.id,
					sceneId: activeSceneId,
					coordinates,
				},
			});
		},
		onDragEnd: (coordinates) => {
			send({
				id: Guid.NewGuid(),
				path: "/tokens/drag",
				method: "Put",
				data: {
					vttTokenId: vttTokenRef.current.id,
					sceneId: activeSceneId,
					coordinates,
				},
			});
		},
		onLongPress: () => {
			openVttTokenRadialMenu(
				vttTokenRef,
				send,
				openNewRadialMenu,
				drag.snapCoordinates,
				worldToScreen(placement),
			);
		},
	});

	useEffect(() => {
		return subscribe("VttTokenDragCanceled", (event) => {
			const payload = event.data as {
				vttTokenId: Guid;
			};
			if (payload.vttTokenId != vttTokenRef.current.id) return;
			drag.cancel();
		});
	}, [subscribe, drag.cancel]);

	const position = worldToScreen(drag.coordinates);
	const pixelScale = PIXELS_PER_CENTIMETER * camera.zoom;
	const width = 100 * pixelScale;
	const height = 100 * pixelScale;
	const left = position.x - width / 2;
	const top = position.y - height / 2;

	return (
		<VttTokenElementContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			className={clsx(
				isActiveLayer ? styles.activeLayer : undefined,
				drag.isRemoteDragging ? styles.remoteDragging : undefined,
			)}
			style={{
				left,
				top,
				width,
				height,
				...(dragResourceLock
					? drag.isLocalDragging
						? { outlineColor: "blue", zIndex: 10000 }
						: { outlineColor: "yellow", zIndex: 9999 }
					: undefined),
			}}
			onPointerDown={drag.onPointerDown}
			onPointerMove={drag.onPointerMove}
			onPointerUp={drag.onPointerUp}
			onContextMenu={(event) => {
				event.preventDefault();
				drag.clearLongPress();
				openVttTokenRadialMenu(
					vttTokenRef,
					send,
					openNewRadialMenu,
					drag.snapCoordinates,
					worldToScreen(placement),
				);
			}}>
			{/* {vttToken.id} */}
		</VttTokenElementContainer>
	);
}
