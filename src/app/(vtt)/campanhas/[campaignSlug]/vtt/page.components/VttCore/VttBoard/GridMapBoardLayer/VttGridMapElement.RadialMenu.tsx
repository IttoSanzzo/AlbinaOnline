import { WindowCursorState } from "../../../Contexts/WindowStates";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { StandartTextColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { clamp, wrap } from "@/utils/Math";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { VttGridMap } from "../../../Types/Classes/VttGridMap";
import { RadialMenuData } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { VttResourceDragSnap } from "../../../Hooks/useVttResourceDrag";
import { Guid } from "@/libs/stp@types";
import { getGridMapSnap } from "./VttGridMapElement.utils";

export function openVttGridMapRadialMenu(
	vttGridMapRef: React.RefObject<VttGridMap>,
	send: (message: VttInputMessage) => void,
	openNewRadialMenu: (props: RadialMenuData) => void,
	snapCoordinates: (
		coordinates: CoordinatePair,
		snap?: VttResourceDragSnap,
	) => CoordinatePair,
) {
	const vttGridMap = vttGridMapRef.current;
	if (!vttGridMap) return;

	openNewRadialMenu({
		id: vttGridMap.id,
		name: "GridMap",
		screenPosition: { x: WindowCursorState.x, y: WindowCursorState.y },
		actionPosition: { x: 0, y: 0 },
		seekMouseOutside: false,
		options: radialMenuOptions,
		nameColor: StandartTextColor["gray"],
		ringWidths: [120],
		onSubmit: (data) => {
			const currentGridMap = vttGridMapRef.current;
			if (!currentGridMap) return;

			const newVttGridMap = {
				...currentGridMap,
				transform: { ...currentGridMap.transform },
				coordinates: { ...currentGridMap.coordinates },
			};
			let shouldSnapAfterTransform = false;

			switch (data.option.id) {
				case "Cancel":
					data.close();
					return;
				case "BringUp":
					break;
				case "Opacity+":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity + 10,
						0,
						100,
					);
					break;
				case "Opacity-":
					newVttGridMap.transform.opacity = clamp(
						newVttGridMap.transform.opacity - 10,
						0,
						100,
					);
					break;
				case "Rotate+":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation + 90,
						0,
						360,
					);
					shouldSnapAfterTransform = true;
					break;
				case "Rotate-":
					newVttGridMap.transform.rotation = wrap(
						newVttGridMap.transform.rotation - 90,
						0,
						360,
					);
					shouldSnapAfterTransform = true;
					break;
				case "MirrorX":
					newVttGridMap.transform.horizontalMirror =
						!newVttGridMap.transform.horizontalMirror;
					shouldSnapAfterTransform = true;
					break;
				case "MirrorY":
					newVttGridMap.transform.verticalMirror =
						!newVttGridMap.transform.verticalMirror;
					shouldSnapAfterTransform = true;
					break;
				case "Reset":
					newVttGridMap.transform = {
						opacity: 100,
						rotation: 0,
						horizontalMirror: false,
						verticalMirror: false,
					};
					shouldSnapAfterTransform = true;
					break;
				case "Duplicate": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps/duplicate",
						method: "Post",
						data: { vttGridMapId: currentGridMap.id },
					});
					return;
				}
				case "Delete": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/scenes/gridmaps",
						method: "Delete",
						data: { vttGridMapId: currentGridMap.id },
					});
					return;
				}
			}

			if (shouldSnapAfterTransform) {
				const snap = getGridMapSnap(
					newVttGridMap.gridMap,
					newVttGridMap.transform.rotation,
					newVttGridMap.transform.horizontalMirror,
					newVttGridMap.transform.verticalMirror,
				);
				newVttGridMap.coordinates = snapCoordinates(
					newVttGridMap.coordinates,
					snap,
				);
			}

			send({
				id: Guid.NewGuid(),
				path: "/scenes/gridmaps",
				method: "Put",
				data: { vttGridMap: newVttGridMap },
			});

			if (data.option.id == "BringUp") data.close();
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
		description: "Trás esse VttGridMap para o topo",
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
		description: "Aumenta a opacidade do VttGridMap (max 100%)",
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
		description: "Diminui a opacidade do VttGridMap (min 0%)",
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
		description: "Rotaciona o VttGridMap em sentido horário",
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
		description: "Rotaciona o VttGridMap em sentido anti-horário",
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
		description: "Espelha esse VttGridMap horizontalmente",
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
		description: "Espelha esse VttGridMap verticalmente",
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
		description: "Duplica esse VttGridMap",
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
		description: "Remove todas as transformações desse VttGridMap",
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
		description: "Remove esse VttGridMap da cena",
	},
];
