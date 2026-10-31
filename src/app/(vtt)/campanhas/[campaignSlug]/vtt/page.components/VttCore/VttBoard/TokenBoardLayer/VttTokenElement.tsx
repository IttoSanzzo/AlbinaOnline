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
import { useCurrentCampaignMemberStore } from "@/libs/stp@hooks";
import { openVttTokenRadialMenu } from "./VttTokenElement.RadialMenu";
import { VttTokenAppearenceRenderer } from "./VttTokenAppearenceRenderer";
import { getVttTokenSnap } from "./VttTokenElement.utils";

const VttTokenElementAnchor = newStyledElement.div(
	styles.vttTokenElementAnchor,
);
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
		snap: getVttTokenSnap(vttToken.appearance),
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
	const width =
		vttToken.appearance.width * (vttToken.appearance.scale / 100) * pixelScale;
	const height =
		vttToken.appearance.height * (vttToken.appearance.scale / 100) * pixelScale;

	return (
		<VttTokenElementAnchor
			style={{
				left: position.x,
				top: position.y,
			}}
			onPointerDown={drag.onPointerDown}
			onPointerMove={drag.onPointerMove}
			onPointerUp={drag.onPointerUp}>
			<VttTokenElementContainer
				style={{
					width,
					height,
				}}>
				<VttTokenAppearenceRenderer
					vttToken={vttToken}
					className={isActiveLayer ? styles.activeLayer : undefined}
				/>
			</VttTokenElementContainer>
		</VttTokenElementAnchor>
	);
}
