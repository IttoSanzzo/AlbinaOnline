import { StandartTextColor } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { RawVttToken, VttToken } from "../../../Types/Classes/VttToken";
import { RadialMenuData } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttResourceDragSnap } from "../../../Hooks/useVttResourceDrag";
import { RadialMenuOption } from "@/components/(SPECIAL)/components/RadialMenu/types";
import { clamp } from "lodash";
import { Guid } from "@/libs/stp@types";
import { wrap } from "@/utils/Math";

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
		actionPosition: { x: position.x, y: position.y },
		seekMouseOutside: false,
		options: radialMenuOptions,
		nameColor: StandartTextColor["gray"],
		ringWidths: [90, 100],
		onSubmit: (data) => {
			const currentToken = vttTokenRef.current;
			if (!currentToken) return;

			const newVttToken: RawVttToken = {
				...currentToken,
				placements: Array.from(vttToken.placements.values()),
			};

			switch (data.option.id) {
				case "Cancel":
				case "Cancel2":
					data.close();
					return;
				case "Appearance-Opacity+":
					newVttToken.appearance.opacity = clamp(
						newVttToken.appearance.opacity + 10,
						0,
						100,
					);
					break;
				case "Appearance-Opacity-":
					newVttToken.appearance.opacity = clamp(
						newVttToken.appearance.opacity - 10,
						0,
						100,
					);
					break;
				case "Appearance-Rotate+":
					newVttToken.appearance.rotation = wrap(
						newVttToken.appearance.rotation + 45,
						0,
						360,
					);
					break;
				case "Appearance-Rotate-":
					newVttToken.appearance.rotation = wrap(
						newVttToken.appearance.rotation - 45,
						0,
						360,
					);
					break;
				case "Appearance-MirrorX":
					newVttToken.appearance.horizontalMirror =
						!newVttToken.appearance.horizontalMirror;
					break;
				case "Appearance-MirrorY":
					newVttToken.appearance.verticalMirror =
						!newVttToken.appearance.verticalMirror;
					break;
				case "Appearance-Reset":
					newVttToken.appearance = {
						...newVttToken.appearance,
						horizontalMirror: false,
						verticalMirror: false,
						scale: 100,
						rotation: 0,
						opacity: 100,
					};
					break;
				// case "Duplicate": {
				// return;
				// }
				case "Danger-Delete": {
					data.close();
					send({
						id: Guid.NewGuid(),
						path: "/tokens",
						method: "Delete",
						data: { vttTokenId: vttToken.id },
					});
					return;
				}
			}

			send({
				id: Guid.NewGuid(),
				path: "/tokens",
				method: "Put",
				data: { vttToken: newVttToken },
			});
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
		id: "SubMenu-Appearence",
		name: "Aparência",
		description: "Opções para alterar a maneira como esse token é reenderizado",
		icon: (
			<StpIcon
				name={"PaintBrush"}
				color={"gray"}
			/>
		),
		options: [
			{
				id: "Appearance-Reset",
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
				id: "Appearance-Opacity+",
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
				id: "Appearance-Opacity-",
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
				id: "Appearance-Rotate+",
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
				id: "Appearance-Rotate-",
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
				id: "Appearance-MirrorX",
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
				id: "Appearance-MirrorY",
				name: "Espelhar Y",
				icon: (
					<StpIcon
						name={"FlipVertical"}
						color={"lightCyan"}
					/>
				),
				description: "Espelha esse VttToken verticalmente",
			},
		],
	},
	{
		id: "SubMenu-Danger",
		name: "Perigo",
		icon: (
			<StpIcon
				name={"WarningCircle"}
				color={"black"}
			/>
		),
		nameColor: StandartTextColor["darkerGray"],
		description: "Ações irreversíveis e perigosas",
		options: [
			{
				id: "Cancel2",
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
				id: "Danger-Delete",
				name: "Deletar",
				icon: (
					<StpIcon
						name={"Trash"}
						color={"black"}
					/>
				),
				nameColor: StandartTextColor["black"],
				backgroundColor: StandartTextColor["evenDarkerRed"],
				description: "Apaga completamente esse VttToken (Sem Volta)",
			},
		],
	},
];
