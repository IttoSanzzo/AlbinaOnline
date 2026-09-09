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
import { StpIcon, StpIconColor } from "@/libs/stp@icons";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { roundCoordinate } from "../../../Utils/coodinateUtils";
import {
	StandartBackgroundColor,
	StandartTextColor,
} from "@/components/(UIBasics)";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import { useAudioManager } from "../../../Contexts/AudioManager/AudioManagerContext";

const PingEngineContainer = newStyledElement.div(styles.pingEngineContainer);
const PING_MESSAGE_TYPE = "PostPing";
const PING_DURATION = 4000;
const PING_MARKER_SIZE = 42;
const PING_MARKER_MARGIN = PING_MARKER_SIZE / 2;
const PING_KEY = "x";
const MAX_PING_TIMEOUT_MS = 5000;
const MAX_PING_COUNT_PER_TIMEOUT = 6;

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
	Help,
	Target,
	Question,
	Move,
	Enemy,
	Ally,
	Observe,
	Wait,
	Yes,
	No,
	Rock,
	Paper,
	Scissor,
	Victory,
	Defeat,
	Suspicious,
	Stop,
	HeeHee,
}

const PING_COLORS: Record<PingType, keyof typeof StpIconColor> = {
	[PingType.Default]: "blue",
	[PingType.Safe]: "green",
	[PingType.Danger]: "red",
	[PingType.Push]: "green",
	[PingType.Retreat]: "red",
	[PingType.Going]: "blue",
	[PingType.Fight]: "yellow",
	[PingType.Attack]: "red",
	[PingType.Defend]: "green",
	[PingType.Help]: "green",
	[PingType.Target]: "red",
	[PingType.Question]: "yellow",
	[PingType.Move]: "blue",
	[PingType.Enemy]: "red",
	[PingType.Ally]: "green",
	[PingType.Observe]: "yellow",
	[PingType.Wait]: "blue",
	[PingType.Yes]: "green",
	[PingType.No]: "red",
	[PingType.Rock]: "red",
	[PingType.Paper]: "blue",
	[PingType.Scissor]: "yellow",
	[PingType.Victory]: "yellow",
	[PingType.Defeat]: "red",
	[PingType.Suspicious]: "purple",
	[PingType.Stop]: "red",
	[PingType.HeeHee]: "pink",
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
	[PingType.Help]: "/sounds/vtt/pings/help.mp3",
	[PingType.Target]: "/sounds/vtt/pings/target.mp3",
	[PingType.Question]: "/sounds/vtt/pings/question.mp3",
	[PingType.Move]: "/sounds/vtt/pings/move.mp3",
	[PingType.Enemy]: "/sounds/vtt/pings/enemy.mp3",
	[PingType.Ally]: "/sounds/vtt/pings/ally.mp3",
	[PingType.Observe]: "/sounds/vtt/pings/observe.mp3",
	[PingType.Wait]: "/sounds/vtt/pings/wait.mp3",
	[PingType.Yes]: "/sounds/vtt/pings/yes.mp3",
	[PingType.No]: "/sounds/vtt/pings/no.mp3",
	[PingType.Rock]: "/sounds/vtt/pings/rock.mp3",
	[PingType.Paper]: "/sounds/vtt/pings/paper.mp3",
	[PingType.Scissor]: "/sounds/vtt/pings/scissor.mp3",
	[PingType.Victory]: "/sounds/vtt/pings/victory.mp3",
	[PingType.Defeat]: "/sounds/vtt/pings/defeat.mp3",
	[PingType.Suspicious]: "/sounds/vtt/pings/suspicious.mp3",
	[PingType.Stop]: "/sounds/vtt/pings/stop.mp3",
	[PingType.HeeHee]: "/sounds/vtt/pings/heehee.mp3",
};

const PING_OPTIONS_MOVEMENT: RadialMenuOption[] = [
	{
		id: PingType[PingType.Going],
		name: "Indo",
		icon: (
			<StpIcon
				name="TelegramLogo"
				color={PING_COLORS[PingType.Going]}
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
				color={PING_COLORS[PingType.Push]}
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
				color={PING_COLORS[PingType.Retreat]}
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
				color={PING_COLORS[PingType.Move]}
			/>
		),
		description: "Mova-se para aqui!",
		backgroundColor: StandartBackgroundColor["lightGray"],
	},
	{
		id: PingType[PingType.Stop],
		name: "Pare",
		icon: (
			<StpIcon
				name="Prohibit"
				color={PING_COLORS[PingType.Stop]}
			/>
		),
		description: "Pare!",
		backgroundColor: StandartBackgroundColor["darkGray"],
	},
];
const PING_OPTIONS_COMBAT: RadialMenuOption[] = [
	{
		id: PingType[PingType.Fight],
		name: "Lutar",
		icon: (
			<StpIcon
				name="Sword"
				color={PING_COLORS[PingType.Fight]}
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
				color={PING_COLORS[PingType.Attack]}
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
				color={PING_COLORS[PingType.Defend]}
			/>
		),
		description: "Defenda aqui!",
		backgroundColor: StandartBackgroundColor["lightGray"],
	},
	{
		id: PingType[PingType.Wait],
		name: "Espere",
		icon: (
			<StpIcon
				name="HourglassHigh"
				color={PING_COLORS[PingType.Wait]}
			/>
		),
		description: "Espere!",
		backgroundColor: StandartBackgroundColor["gray"],
	},
	{
		id: PingType[PingType.Victory],
		name: "Vitória",
		icon: (
			<StpIcon
				name="Trophy"
				color={PING_COLORS[PingType.Victory]}
			/>
		),
		description: "Vitória em combate!",
		backgroundColor: StandartBackgroundColor["lightGray"],
	},
	{
		id: PingType[PingType.Defeat],
		name: "Derrota",
		icon: (
			<StpIcon
				name="Cross"
				color={PING_COLORS[PingType.Defeat]}
			/>
		),
		description: "Derrota em combate!",
		backgroundColor: StandartBackgroundColor["gray"],
	},
];
const PING_OPTIONS_PEOPLE: RadialMenuOption[] = [
	{
		id: PingType[PingType.Observe],
		name: "Observar",
		icon: (
			<StpIcon
				name="Eye"
				color={PING_COLORS[PingType.Observe]}
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
				color={PING_COLORS[PingType.Ally]}
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
				color={PING_COLORS[PingType.Enemy]}
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
				color={PING_COLORS[PingType.Target]}
			/>
		),
		description: "Este é o alvo!",
		backgroundColor: StandartBackgroundColor["gray"],
	},
	{
		id: PingType[PingType.Suspicious],
		name: "Suspeito",
		icon: (
			<StpIcon
				name="SealQuestion"
				color={PING_COLORS[PingType.Suspicious]}
			/>
		),
		description: "Suspeito...",
		backgroundColor: StandartBackgroundColor["darkGray"],
	},
];
const PING_OPTIONS_OTHERS_RESPONSES: RadialMenuOption[] = [
	{
		id: PingType[PingType.Yes],
		name: "Sim",
		icon: (
			<StpIcon
				name="ThumbsUp"
				color={PING_COLORS[PingType.Yes]}
			/>
		),
		description: "Sim!",
		backgroundColor: StandartBackgroundColor["darkGreen"],
		fastKey: "s",
	},
	{
		id: PingType[PingType.No],
		name: "Não",
		icon: (
			<StpIcon
				name="ThumbsDown"
				color={PING_COLORS[PingType.No]}
			/>
		),
		description: "Não!",
		backgroundColor: StandartBackgroundColor["darkRed"],
		fastKey: "n",
	},
];
const PING_OPTIONS_OTHERS_MEMES: RadialMenuOption[] = [
	{
		id: PingType[PingType.HeeHee],
		name: "Hee Hee",
		icon: (
			<StpIcon
				name="MicrophoneStage"
				color={PING_COLORS[PingType.HeeHee]}
			/>
		),
		description: "Hee hee!",
		backgroundColor: StandartBackgroundColor["darkPink"],
	},
	{
		id: PingType[PingType.Stop],
		name: "Pare",
		icon: (
			<StpIcon
				name="Prohibit"
				color={PING_COLORS[PingType.Stop]}
			/>
		),
		description: "Pare!",
		backgroundColor: StandartBackgroundColor["darkRed"],
	},
];
const PING_OPTIONS_OTHERS_JANKEN: RadialMenuOption[] = [
	{
		id: PingType[PingType.Rock],
		name: "Pedra",
		icon: (
			<StpIcon
				name="HandFist"
				color={PING_COLORS[PingType.Rock]}
			/>
		),
		description: "Pedra!",
		backgroundColor: StandartBackgroundColor["darkRed"],
		fastKey: "j",
	},
	{
		id: PingType[PingType.Paper],
		name: "Papel",
		icon: (
			<StpIcon
				name="HandPalm"
				color={PING_COLORS[PingType.Paper]}
			/>
		),
		description: "Papel!",
		backgroundColor: StandartBackgroundColor["darkBlue"],
		fastKey: "k",
	},
	{
		id: PingType[PingType.Scissor],
		name: "Tesoura",
		icon: (
			<StpIcon
				name="HandPeace"
				color={PING_COLORS[PingType.Scissor]}
			/>
		),
		description: "Tesoura!",
		backgroundColor: StandartBackgroundColor["darkYellow"],
		fastKey: "p",
	},
];
const PING_OPTIONS_OTHERS: RadialMenuOption[] = [
	{
		id: "Responses",
		name: "Respostas",
		icon: (
			<StpIcon
				name="ChatsCircle"
				color="blue"
			/>
		),
		description: "Respostas simples.",
		backgroundColor: StandartBackgroundColor["lightGray"],
		options: PING_OPTIONS_OTHERS_RESPONSES,
	},
	{
		id: "Memes",
		name: "Memes",
		icon: (
			<StpIcon
				name="Cheers"
				color="pink"
			/>
		),
		description: "Memes e outros aleatórios.",
		backgroundColor: StandartBackgroundColor["darkBlue"],
		options: PING_OPTIONS_OTHERS_MEMES,
	},
	{
		id: "Janken",
		name: "Janken",
		icon: (
			<StpIcon
				name="Hand"
				color="purple"
			/>
		),
		description: "Jogo de Pedra, Papel ou Tesoura.",
		backgroundColor: StandartBackgroundColor["gray"],
		options: PING_OPTIONS_OTHERS_JANKEN,
	},
];
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
		options: PING_OPTIONS_MOVEMENT,
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
		options: PING_OPTIONS_COMBAT,
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
		options: PING_OPTIONS_PEOPLE,
	},
	{
		id: "Others",
		name: "Outros",
		icon: (
			<StpIcon
				name="List"
				color="gray"
			/>
		),
		description: "Outros Pings.",
		backgroundColor: StandartBackgroundColor["darkGray"],
		options: PING_OPTIONS_OTHERS,
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

	if (isInside)
		return {
			position: screenPosition,
			offscreen: false,
		};

	const directionX = screenPosition.x - centerX;
	const directionY = screenPosition.y - centerY;
	if (directionX === 0 && directionY === 0)
		return {
			position: {
				x: centerX,
				y: centerY,
			},
			offscreen: true,
		};

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

export function PingEngine() {
	const radialMenu = useRadialMenu();
	const { send, subscribe } = useVttContext();
	const { viewport, screenToWorld, worldToScreen, setCameraPosition } =
		useVttViewportContext();
	const { members } = useVttMembersContext();
	const { play } = useAudioManager();
	const [pings, setPings] = useState<Ping[]>([]);
	const pingTimestampsRef = useRef<number[]>([]);
	const lastPingType = useRef<keyof typeof PingType>("Default");

	const mousePositionRef = useRef({
		x: viewport.width / 2,
		y: viewport.height / 2,
	});

	function playPingSound(type: PingType, userId: Guid) {
		const source = PING_SOUNDS[type];
		if (!source) return;
		play({
			path: source,
			type: "vtt.pings",
			sourceId: userId,
		});
	}

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

	function sendPing(type: keyof typeof PingType, position: CoordinatePair) {
		const now = Date.now();
		const windowStart = now - MAX_PING_TIMEOUT_MS;
		lastPingType.current = type;
		pingTimestampsRef.current = pingTimestampsRef.current.filter(
			(timestamp) => timestamp > windowStart,
		);
		if (pingTimestampsRef.current.length >= MAX_PING_COUNT_PER_TIMEOUT) return;
		pingTimestampsRef.current.push(now);
		send({
			id: Guid.NewGuid(),
			type: PING_MESSAGE_TYPE,
			data: {
				type: type,
				position: position,
			},
		});
	}

	const openPingMenu = useCallback(
		(mode: "fast" | "switch") => {
			const screenPosition = mousePositionRef.current;
			const worldPosition = roundCoordinate(screenToWorld(screenPosition));

			radialMenu.openNew({
				mode,
				id: "ping",
				name: "Ping",
				overlay: false,
				screenPosition,
				actionPosition: worldPosition,
				options: PING_OPTIONS,
				ringWidths: [100, 80, 65],
				submitKeys: [PING_KEY],
				nameColor: StandartTextColor["gray"],
				onSubmit: (props: RadialMenuSubmitProps) => {
					sendPing(
						props.option.id as keyof typeof PingType,
						props.cursorPosition,
					);
					props.close();
				},
			});
		},
		[radialMenu, screenToWorld, send],
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				event.repeat ||
				!(event.ctrlKey && event.key.toLowerCase() === PING_KEY)
			)
				return;
			event.preventDefault();
			if (event.shiftKey) {
				if (event.altKey) {
					sendPing(
						lastPingType.current,
						roundCoordinate(screenToWorld(mousePositionRef.current)),
					);
				} else openPingMenu("switch");
			} else openPingMenu("fast");
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
			playPingSound(PingType[data.type], data.userId);
			window.setTimeout(() => {
				setPings((current) =>
					current.filter((currentPing) => currentPing.id !== ping.id),
				);
			}, PING_DURATION);
		});
	}, [subscribe, members, playPingSound]);

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
