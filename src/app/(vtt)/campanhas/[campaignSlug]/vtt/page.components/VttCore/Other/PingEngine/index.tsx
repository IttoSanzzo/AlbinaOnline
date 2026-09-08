"use client";

import styles from "./index.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useRadialMenu } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import {
	RadialMenuOption,
	RadialMenuSubmitProps,
} from "@/components/(SPECIAL)/components/RadialMenu/types";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttViewportContext } from "../../../Contexts/VttViewportContextProvider";
import { Guid } from "@/libs/stp@types";
import { StpIcon } from "@/libs/stp@icons";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { roundCoordinate } from "../../../Utils/coodinateUtils";
import {
	StandartBackgroundColor,
	StandartTextColor,
} from "@/components/(UIBasics)";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";

const PingEngineContainer = newStyledElement.div(styles.pingEngineContainer);
const PING_MESSAGE_TYPE = "PostPing";
const PING_DURATION = 4000;
const PING_MARKER_SIZE = 42;
const PING_MARKER_MARGIN = PING_MARKER_SIZE / 2;
const PING_KEY = "p";

interface Ping {
	id: string;
	type: keyof typeof PingType;
	position: CoordinatePair;
	timestamp: number;
	nickname?: string;
}

enum PingType {
	Default,
	Safe,
	Danger,
	Push,
	Retreat,
	Going,
	Fight,
	Attack,
	Defend,
	Charge,
	Help,
	Target,
	Question,
	Move,
	Enemy,
	Ally,
	Observe,
}

const PING_COLORS: Record<PingType, string> = {
	[PingType.Default]: "blue",
	[PingType.Safe]: "green",
	[PingType.Danger]: "red",
	[PingType.Push]: "green",
	[PingType.Retreat]: "yellow",
	[PingType.Going]: "blue",
	[PingType.Fight]: "yellow",
	[PingType.Attack]: "red",
	[PingType.Defend]: "green",
	[PingType.Charge]: "red",
	[PingType.Help]: "green",
	[PingType.Target]: "red",
	[PingType.Question]: "yellow",
	[PingType.Move]: "blue",
	[PingType.Enemy]: "red",
	[PingType.Ally]: "green",
	[PingType.Observe]: "yellow",
};

const PING_SOUNDS: Record<PingType, string> = {
	[PingType.Default]: "/sounds/vtt/pings/default.mp3",
	[PingType.Safe]: "/sounds/vtt/pings/safe.mp3",
	[PingType.Danger]: "/sounds/vtt/pings/danger.mp3",
	[PingType.Push]: "/sounds/vtt/pings/push.mp3",
	[PingType.Retreat]: "/sounds/vtt/pings/retreat.mp3",
	[PingType.Going]: "/sounds/vtt/pings/going.mp3",
	[PingType.Fight]: "/sounds/vtt/pings/fight.mp3",
	[PingType.Attack]: "/sounds/vtt/pings/attack.mp3",
	[PingType.Defend]: "/sounds/vtt/pings/defend.mp3",
	[PingType.Charge]: "/sounds/vtt/pings/charge.mp3",
	[PingType.Help]: "/sounds/vtt/pings/help.mp3",
	[PingType.Target]: "/sounds/vtt/pings/target.mp3",
	[PingType.Question]: "/sounds/vtt/pings/question.mp3",
	[PingType.Move]: "/sounds/vtt/pings/move.mp3",
	[PingType.Enemy]: "/sounds/vtt/pings/enemy.mp3",
	[PingType.Ally]: "/sounds/vtt/pings/ally.mp3",
	[PingType.Observe]: "/sounds/vtt/pings/observe.mp3",
};

const PING_OPTIONS: RadialMenuOption[] = [
	{
		id: PingType[PingType.Default],
		name: "Neutro",
		icon: (
			<StpIcon
				name="MapPinSimpleArea"
				color="blue"
			/>
		),
		description: "Ping sem significado inerente.",
		backgroundColor: StandartBackgroundColor["gray"],
	},
	{
		id: PingType[PingType.Safe],
		name: "Seguro",
		icon: (
			<StpIcon
				name="Lifebuoy"
				color="green"
			/>
		),
		description: "Seguro aqui!",
		backgroundColor: StandartBackgroundColor["lightGray"],
	},
	{
		id: PingType[PingType.Danger],
		name: "Perigo",
		icon: (
			<StpIcon
				name="Warning"
				color="red"
			/>
		),
		description: "Perigo aqui!",
		backgroundColor: StandartBackgroundColor["gray"],
	},
	{
		id: PingType[PingType.Question],
		name: "Incerteza",
		icon: (
			<StpIcon
				name="Question"
				color="yellow"
			/>
		),
		description: "Incerteza aqui!",
		backgroundColor: StandartBackgroundColor["lightGray"],
	},
	{
		id: PingType[PingType.Help],
		name: "Ajuda",
		icon: (
			<StpIcon
				name="FlagBannerFold"
				color="green"
			/>
		),
		description: "Ajude aqui!",
		backgroundColor: StandartBackgroundColor["gray"],
	},
	{
		id: "Movement",
		name: "Movimento",
		icon: (
			<StpIcon
				name="Footprints"
				color="blue"
			/>
		),
		description: "Comandos relacionados a movimento.",
		backgroundColor: StandartBackgroundColor["lightGray"],
		options: [
			{
				id: PingType[PingType.Going],
				name: "Indo",
				icon: (
					<StpIcon
						name="TelegramLogo"
						color="blue"
					/>
				),
				description: "Estou indo para aqui!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
			{
				id: PingType[PingType.Push],
				name: "Avançar",
				icon: (
					<StpIcon
						name="FastForward"
						color="green"
					/>
				),
				description: "Avançar aqui!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
			{
				id: PingType[PingType.Retreat],
				name: "Recuar",
				icon: (
					<StpIcon
						name="Rewind"
						color="yellow"
					/>
				),
				description: "Recuar para aqui!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
			{
				id: PingType[PingType.Move],
				name: "Mover",
				icon: (
					<StpIcon
						name="Signpost"
						color="blue"
					/>
				),
				description: "Mova-se para aqui!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
		],
	},
	{
		id: "Combat",
		name: "Combate",
		icon: (
			<StpIcon
				name="Sword"
				color="yellow"
			/>
		),
		description: "Comandos relacionados a combate.",
		backgroundColor: StandartBackgroundColor["gray"],
		options: [
			{
				id: PingType[PingType.Fight],
				name: "Lutar",
				icon: (
					<StpIcon
						name="Sword"
						color="yellow"
					/>
				),
				description: "Lutar aqui!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
			{
				id: PingType[PingType.Attack],
				name: "Atacar",
				icon: (
					<StpIcon
						name="Sword"
						color="red"
					/>
				),
				description: "Ataque este alvo!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
			{
				id: PingType[PingType.Defend],
				name: "Defender",
				icon: (
					<StpIcon
						name="ShieldCheckered"
						color="green"
					/>
				),
				description: "Defenda aqui!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
			{
				id: PingType[PingType.Charge],
				name: "Investir",
				icon: (
					<StpIcon
						name="Lightning"
						color="red"
					/>
				),
				description: "Invista contra este alvo!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
		],
	},
	{
		id: "People",
		name: "Pessoas",
		icon: (
			<StpIcon
				name="UsersThree"
				color="blue"
			/>
		),
		description: "Identificação de pessoas e alvos.",
		backgroundColor: StandartBackgroundColor["lightGray"],
		options: [
			{
				id: PingType[PingType.Observe],
				name: "Observar",
				icon: (
					<StpIcon
						name="Eye"
						color="yellow"
					/>
				),
				description: "Observe esta pessoa!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
			{
				id: PingType[PingType.Ally],
				name: "Aliado",
				icon: (
					<StpIcon
						name="UserCircle"
						color="green"
					/>
				),
				description: "Aliado aqui!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
			{
				id: PingType[PingType.Enemy],
				name: "Inimigo",
				icon: (
					<StpIcon
						name="UserCircle"
						color="red"
					/>
				),
				description: "Inimigo aqui!",
				backgroundColor: StandartBackgroundColor["lightGray"],
			},
			{
				id: PingType[PingType.Target],
				name: "Alvo",
				icon: (
					<StpIcon
						name="Crosshair"
						color="red"
					/>
				),
				description: "Este é o alvo!",
				backgroundColor: StandartBackgroundColor["gray"],
			},
		],
	},
];

function findPingOption(
	options: RadialMenuOption[],
	id: keyof typeof PingType,
): RadialMenuOption | undefined {
	for (const option of options) {
		if (option.id === id) return option;
		if (option.options) {
			const result = findPingOption(option.options, id);
			if (result) return result;
		}
	}

	return undefined;
}

function getPingScreenPosition(
	worldPosition: CoordinatePair,
	worldToScreen: (position: CoordinatePair) => CoordinatePair,
): {
	position: CoordinatePair;
	offscreen: boolean;
} {
	const screenPosition = worldToScreen(worldPosition);

	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const centerX = viewportWidth / 2;
	const centerY = viewportHeight / 2;

	const isInside =
		screenPosition.x >= PING_MARKER_MARGIN &&
		screenPosition.x <= viewportWidth - PING_MARKER_MARGIN &&
		screenPosition.y >= PING_MARKER_MARGIN &&
		screenPosition.y <= viewportHeight - PING_MARKER_MARGIN;

	if (isInside) {
		return {
			position: screenPosition,
			offscreen: false,
		};
	}

	const directionX = screenPosition.x - centerX;
	const directionY = screenPosition.y - centerY;

	if (directionX === 0 && directionY === 0) {
		return {
			position: {
				x: centerX,
				y: centerY,
			},
			offscreen: true,
		};
	}

	const halfWidth = viewportWidth / 2 - PING_MARKER_MARGIN;
	const halfHeight = viewportHeight / 2 - PING_MARKER_MARGIN;

	const scaleX =
		directionX === 0
			? Number.POSITIVE_INFINITY
			: halfWidth / Math.abs(directionX);

	const scaleY =
		directionY === 0
			? Number.POSITIVE_INFINITY
			: halfHeight / Math.abs(directionY);

	const scale = Math.min(scaleX, scaleY);

	return {
		position: {
			x: centerX + directionX * scale,
			y: centerY + directionY * scale,
		},
		offscreen: true,
	};
}

function playPingSound(type: PingType) {
	const source = PING_SOUNDS[type];

	if (!source) return;

	const audio = new Audio(source);
	audio.volume = 1;
	void audio.play().catch(() => {});
}

export function PingEngine() {
	const radialMenu = useRadialMenu();
	const { send, subscribe } = useVttContext();
	const { screenToWorld, worldToScreen, setCameraPosition } =
		useVttViewportContext();
	const { members } = useVttMembersContext();
	const [pings, setPings] = useState<Ping[]>([]);
	const pingTimestampsRef = useRef<number[]>([]);

	const mousePositionRef = useRef({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			mousePositionRef.current = {
				x: event.clientX,
				y: event.clientY,
			};
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	const openPingMenu = useCallback(() => {
		const screenPosition = mousePositionRef.current;
		const worldPosition = roundCoordinate(screenToWorld(screenPosition));

		radialMenu.openNew({
			mode: "fast",
			id: "ping",
			name: "Ping",
			overlay: false,
			screenPosition,
			actionPosition: worldPosition,
			options: PING_OPTIONS,
			ringWidths: [110],
			submitKeys: [PING_KEY],
			nameColor: StandartTextColor["gray"],
			onSubmit: (props: RadialMenuSubmitProps) => {
				const now = Date.now();
				const windowStart = now - 5000;

				pingTimestampsRef.current = pingTimestampsRef.current.filter(
					(timestamp) => timestamp > windowStart,
				);

				if (pingTimestampsRef.current.length >= 6) {
					props.close();
					return;
				}

				pingTimestampsRef.current.push(now);

				send({
					id: Guid.NewGuid(),
					type: PING_MESSAGE_TYPE,
					data: {
						type: props.option.id,
						position: props.cursorPosition,
					},
				});

				props.close();
			},
		});
	}, [radialMenu, screenToWorld, send]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat) return;
			if (event.key.toLowerCase() !== PING_KEY) return;
			event.preventDefault();
			openPingMenu();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [openPingMenu]);

	useEffect(() => {
		return subscribe(PING_MESSAGE_TYPE, (message) => {
			const data = message.data as {
				type: keyof typeof PingType;
				userId: Guid;
				position: CoordinatePair;
			};
			if (!data?.position) return;
			const nickname = members.find((member) => member.userId == data.userId)
				?.user.nickname;
			const ping: Ping = {
				id: crypto.randomUUID(),
				type: data.type,
				position: {
					x: data.position.x,
					y: data.position.y,
				},
				nickname,
				timestamp: Date.now(),
			};
			setPings((current) => [...current, ping]);
			playPingSound(PingType[data.type]);
			window.setTimeout(() => {
				setPings((current) =>
					current.filter((currentPing) => currentPing.id !== ping.id),
				);
			}, PING_DURATION);
		});
	}, [subscribe, members]);

	return (
		<PingEngineContainer>
			{pings.map((ping) => {
				const { position, offscreen } = getPingScreenPosition(
					ping.position,
					worldToScreen,
				);
				const option = findPingOption(PING_OPTIONS, ping.type);
				const icon = option?.icon ?? "Ping";

				return (
					<div
						key={ping.id}
						className={`${styles.ping} ${
							offscreen ? styles.pingOffscreen : ""
						}`}
						style={{
							left: position.x,
							top: position.y,
							color: PING_COLORS[PingType[ping.type]],
						}}
						data-cursor-hover-interaction-type={
							offscreen ? "Pointer" : undefined
						}
						title={option?.name ?? "Ping"}
						onClick={
							offscreen
								? () => {
										setCameraPosition(ping.position.x, ping.position.y);
									}
								: undefined
						}>
						<div className={styles.pingMarker}>
							<div className={styles.pingWave} />
							<div className={styles.pingWave} />
							{icon}
						</div>

						{ping.nickname && (
							<div className={styles.pingNickname}>{ping.nickname}</div>
						)}
					</div>
				);
			})}
		</PingEngineContainer>
	);
}
