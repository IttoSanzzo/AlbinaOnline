import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttTokenElement.module.css";
import { VttToken, VttTokenPlacement } from "../../../Types/Classes/VttToken";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VTTTOKEN_RENDER_THROTTLE } from "./VttTokenElementWrapper";
import {
	RadialMenuData,
	useRadialMenuActions,
} from "@/components/(SPECIAL)/components/RadialMenu/Context";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";
import { useEffect, useRef } from "react";
import {
	useVttResourceDrag,
	VttResourceDragSnap,
} from "../../../Hooks/useVttResourceDrag";
import { Guid } from "@/libs/stp@types";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { StandartTextColor } from "@/components/(UIBasics)";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { StpIcon } from "@/libs/stp@icons";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";

const VttTokenElementContainer = newStyledElement.div(
	styles.vttTokenElementContainer,
);

interface VttTokenElementProps {
	vttToken: VttToken;
	placement: VttTokenPlacement;
}
export function VttTokenElement({ vttToken, placement }: VttTokenElementProps) {
	const { openNew: openNewRadialMenu } = useRadialMenuActions();
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

	const drag = useVttResourceDrag({
		coordinates: placement.coordinates,
		resourceLock: dragResourceLock,
		enabled: isActiveLayer,
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
			openRadialMenu(
				vttTokenRef,
				send,
				openNewRadialMenu,
				drag.snapCoordinates,
				worldToScreen(placement.coordinates),
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
			className={isActiveLayer ? styles.activeLayer : undefined}
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
				openRadialMenu(
					vttTokenRef,
					send,
					openNewRadialMenu,
					drag.snapCoordinates,
					worldToScreen(placement.coordinates),
				);
			}}>
			{/* {vttToken.id} */}
		</VttTokenElementContainer>
	);
}

function openRadialMenu(
	vttTokenRef: React.RefObject<VttToken>,
	send: (message: VttInputMessage) => void,
	openNewRadialMenu: (props: RadialMenuData) => void,
	snapCoordinates: (
		coordinates: CoordinatePair,
		snap?: VttResourceDragSnap,
	) => CoordinatePair,
	position: CoordinatePair,
) {
	const vttToken = vttTokenRef.current;
	if (!vttToken) return;

	openNewRadialMenu({
		id: vttToken.id,
		name: "Token",
		screenPosition: { x: position.x, y: position.y },
		actionPosition: { x: 0, y: 0 },
		seekMouseOutside: false,
		options: radialMenuOptions,
		nameColor: StandartTextColor["gray"],
		ringWidths: [120],
		onSubmit: (data) => {
			const currentToken = vttTokenRef.current;
			if (!currentToken) return;

			// const newVttToken = {
			// 	...currentToken,
			// 	// transform: { ...currentToken.transform },
			// 	// coordinates: { ...currentToken.coordinates },
			// };
			// let shouldSnapAfterTransform = false;

			switch (data.option.id) {
				case "Cancel":
					data.close();
					return;
				case "BringUp":
					break;
				case "Opacity+":
					break;
				case "Opacity-":
					break;
				case "Rotate+":
					// shouldSnapAfterTransform = true;
					break;
				case "Rotate-":
					// shouldSnapAfterTransform = true;
					break;
				case "MirrorX":
					break;
				case "MirrorY":
					break;
				case "Reset":
					break;
				case "Duplicate": {
					return;
				}
				case "Delete": {
					return;
				}
			}
			// send({
			// 	id: Guid.NewGuid(),
			// 	path: "/tokens",
			// 	method: "Put",
			// 	data: { vttToken: newVttToken },
			// });
		},
	});
}
const radialMenuOptions: RadialMenuOption[] = [
	{
		id: "Cancel",
		name: "Cancelar",
		nameColor: StandartTextColor["lightGray"],
		backgroundColor: StandartTextColor["darkerGray"],
		icon: (
			<StpIcon
				name={"XCircle"}
				color={"gray"}
			/>
		),
		description: "Fecha esse menu radial",
	},
	{
		id: "BringUp",
		name: "PinUp",
		icon: (
			<StpIcon
				name={"CaretCircleUp"}
				color={"gray"}
			/>
		),
		description: "Trás esse VttToken para o topo",
	},
	{
		id: "Opacity+",
		name: "Opacidade +",
		icon: (
			<StpIcon
				name={"Sunglasses"}
				color={"lightCyan"}
			/>
		),
		description: "Aumenta a opacidade do VttToken (max 100%)",
	},
	{
		id: "Opacity-",
		name: "Opacidade -",
		icon: (
			<StpIcon
				name={"Eyeglasses"}
				color={"lightCyan"}
			/>
		),
		description: "Diminui a opacidade do VttToken (min 0%)",
	},
	{
		id: "Rotate+",
		name: "Rotacionar +",
		icon: (
			<StpIcon
				name={"ArrowClockwise"}
				color={"lightCyan"}
			/>
		),
		description: "Rotaciona o VttToken em sentido horário",
	},
	{
		id: "Rotate-",
		name: "Rotacionar -",
		icon: (
			<StpIcon
				name={"ArrowCounterClockwise"}
				color={"lightCyan"}
			/>
		),
		description: "Rotaciona o VttToken em sentido anti-horário",
	},
	{
		id: "MirrorX",
		name: "Espelhar X",
		icon: (
			<StpIcon
				name={"FlipHorizontal"}
				color={"lightCyan"}
			/>
		),
		description: "Espelha esse VttToken horizontalmente",
	},
	{
		id: "MirrorY",
		name: "Espelhar Y",
		icon: (
			<StpIcon
				name={"FlipVertical"}
				color={"lightCyan"}
			/>
		),
		description: "Espelha esse VttToken verticalmente",
	},
	{
		id: "Duplicate",
		name: "Duplicar",
		icon: (
			<StpIcon
				name={"Copy"}
				color={"gray"}
				style={"fill"}
			/>
		),
		description: "Duplica esse VttToken",
	},
	{
		id: "Reset",
		name: "Resetar",
		icon: (
			<StpIcon
				name={"Recycle"}
				color={"gray"}
			/>
		),
		description: "Remove todas as transformações desse VttToken",
	},
	{
		id: "Delete",
		name: "Remover",
		icon: (
			<StpIcon
				name={"Trash"}
				color={"black"}
			/>
		),
		nameColor: StandartTextColor["black"],
		backgroundColor: StandartTextColor["darkRed"],
		description: "Remove esse VttToken da cena",
	},
];
