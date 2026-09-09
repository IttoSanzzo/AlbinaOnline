"use client";

import styles from "./PlayerConnectionChange.module.css";
import { useEffect, useRef } from "react";
import { Guid } from "@/libs/stp@types";
import toast from "react-hot-toast";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useAudioManager } from "../../../Contexts/AudioManager/AudioManagerContext";

const PLAYER_JOINING = "/sounds/vtt/player-events/joining.mp3";
const PLAYER_JOIN_SOUND = "/sounds/vtt/player-events/connected.mp3";
const PLAYER_LEAVE_SOUND = "/sounds/vtt/player-events/disconnected.mp3";

export function PlayerConnectionChange() {
	const { connectedUserIds, members } = useVttMembersContext();
	const { play } = useAudioManager();
	const previousUserIds = useRef<Set<Guid> | null>(null);

	useEffect(() => {
		if (connectedUserIds.size == 0 && previousUserIds.current == null) return;
		if (previousUserIds.current === null) {
			previousUserIds.current = connectedUserIds;
			play({
				path: PLAYER_JOINING,
				type: "players.self_greeting",
			});
			toast.success("Conectado");
			return;
		}

		const previous = previousUserIds.current;
		const joinedUserId = [...connectedUserIds].find(
			(userId) => !previous.has(userId),
		);
		if (joinedUserId) {
			const member = members.find((member) => member.userId === joinedUserId);
			toast.success(`${member?.user.nickname ?? "Um jogador"} se conectou`, {
				id: joinedUserId,
				icon: (
					<Image
						src={getAlbinaApiFullAddress(`/favicon/users/id/${joinedUserId}`)}
						alt=""
						width={30}
						height={30}
						className={styles.toastIconStyle}
					/>
				),
			});
			play({
				path: PLAYER_JOIN_SOUND,
				type: "players.greetings",
				sourceId: joinedUserId,
			});
		}

		const leftUserId = [...previous].find(
			(userId) => !connectedUserIds.has(userId),
		);
		if (leftUserId) {
			const member = members.find((member) => member.userId === leftUserId);
			toast.error(`${member?.user.nickname ?? "Um jogador"} se desconectou`, {
				id: leftUserId,
				icon: (
					<Image
						src={getAlbinaApiFullAddress(`/favicon/users/id/${leftUserId}`)}
						alt=""
						width={30}
						height={30}
						className={styles.toastIconStyle}
					/>
				),
			});
			play({
				path: PLAYER_LEAVE_SOUND,
				type: "players.greetings",
				sourceId: leftUserId,
			});
		}
		previousUserIds.current = connectedUserIds;
	}, [connectedUserIds, members, play]);

	return null;
}
