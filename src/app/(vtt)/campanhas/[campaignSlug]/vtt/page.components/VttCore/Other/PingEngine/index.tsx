"use client";

import styles from "./index.module.css";
import { useCallback, useEffect, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useRadialMenu } from "@/components/(SPECIAL)/components/RadialMenu/Context";
import {
	RadialMenuOption,
	RadialMenuSubmitProps,
} from "@/components/(SPECIAL)/components/RadialMenu/types";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttViewportContext } from "../../../Contexts/VttViewportContextProvider";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { roundCoordinate } from "../../../Utils/CoodinateUtils";
import { StandartTextColor } from "@/components/(UIBasics)";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import { PING_COLORS, PING_OPTIONS, PingType } from "./PingRadialWheelTypes";
import { useVttAudioController } from "../../../Contexts/AudioManager/VttAudioControllerContext";
import { WindowCursorState } from "../../../Contexts/WindowStates";
import {
	VttElementDataAttribute,
	hasClosestAttribute,
	setVttElementHoverInteraction,
} from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/Classes/VttMouseState";
import { isFormElement } from "@/utils/General";
import { audioPaths } from "../../../Contexts/AudioManager/audioPaths";
import { VttInputMessage } from "../../../Types/Core/VttInputMessage";

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

let pingTimestamps: number[] = [];
let lastPingType: keyof typeof PingType = "Default";

interface sendPingProps {
	type?: keyof typeof PingType;
	position: CoordinatePair;
	send: (message: VttInputMessage) => void;
}
export function sendPing({ position, type, send }: sendPingProps) {
	const now = Date.now();
	const windowStart = now - MAX_PING_TIMEOUT_MS;
	type ??= lastPingType;
	lastPingType = type;
	pingTimestamps = pingTimestamps.filter(
		(timestamp) => timestamp > windowStart,
	);
	if (pingTimestamps.length >= MAX_PING_COUNT_PER_TIMEOUT) return;
	pingTimestamps.push(now);
	send({
		id: Guid.NewGuid(),
		path: "/ping",
		method: "Post",
		data: {
			type: type,
			position: position,
		},
	});
}

export function PingEngine() {
	const radialMenu = useRadialMenu();
	const { send, subscribe } = useVttContext();
	const { screenToWorld, worldToScreen, setCameraPosition } =
		useVttViewportContext();
	const { members } = useVttMembersContext();
	const { play } = useVttAudioController();
	const [pings, setPings] = useState<Ping[]>([]);

	function playPingSound(type: PingType, userId: Guid) {
		const source = audioPaths.vtt.pings[type];
		if (!source) return;
		play({
			path: source,
			type: "vtt.pings",
			sourceId: userId,
		});
	}

	const openPingMenu = useCallback(
		(mode: "fast" | "switch") => {
			const screenPosition = { x: WindowCursorState.x, y: WindowCursorState.y };
			const worldPosition = roundCoordinate(screenToWorld(screenPosition));

			radialMenu.openNew({
				mode,
				id: "ping",
				name: "Ping",
				overlay: false,
				screenPosition: screenPosition,
				actionPosition: worldPosition,
				options: PING_OPTIONS,
				ringWidths: [100, 80, 65],
				submitKeys: [PING_KEY],
				nameColor: StandartTextColor["gray"],
				onSubmit: (props: RadialMenuSubmitProps) => {
					sendPing({
						type: props.option.id as keyof typeof PingType,
						position: props.cursorPosition,
						send: send,
					});
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
				!(event.ctrlKey && event.key.toLowerCase() === PING_KEY) ||
				isFormElement(event.target as Element) ||
				!hasClosestAttribute(
					WindowCursorState.element,
					VttElementDataAttribute.EventPing,
				)
			)
				return;
			event.preventDefault();
			if (event.shiftKey) {
				if (event.altKey) {
					sendPing({
						position: roundCoordinate(screenToWorld(WindowCursorState)),
						send: send,
					});
				} else openPingMenu("switch");
			} else openPingMenu("fast");
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
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
						{...setVttElementHoverInteraction(
							offscreen ? VttCursorInteractionType.Pointer : undefined,
						)}
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
