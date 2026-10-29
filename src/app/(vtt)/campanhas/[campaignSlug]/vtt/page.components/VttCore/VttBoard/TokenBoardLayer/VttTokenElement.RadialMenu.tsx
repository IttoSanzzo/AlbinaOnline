import { StandartTextColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { VttToken } from "../../../Types/Classes/VttToken";
import { RadialMenuData } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttResourceDragSnap } from "../../../Hooks/useVttResourceDrag";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";

export function openVttTokenRadialMenu(
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
