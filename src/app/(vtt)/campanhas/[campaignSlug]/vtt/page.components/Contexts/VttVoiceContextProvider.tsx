"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { CampaignMember, Guid } from "@/libs/stp@types";
import { createStore, StoreApi, useStore } from "zustand";
import { useVttMembersStore, VttExternalIds } from "./VttMembersProvider";

const REACTIVE_ORIGIN = "https://reactive.fugi.tech";
const REACTIVE_URL = `${REACTIVE_ORIGIN}/basic/`;

const HEARTBEAT_TIMEOUT = 15000;
const RELOAD_INTERVAL = 60000;
const MONITOR_INTERVAL = 1000;

export interface VttVoiceState {
	inCall: boolean;
	speaking: boolean;
	muted: boolean;
	deafened: boolean;
}

export interface VttVoiceStoreState {
	voiceStates: Map<Guid, VttVoiceState | undefined>;

	syncMembers: (userIds: Guid[]) => void;
	setVoiceState: (userId: Guid, state: VttVoiceState | undefined) => void;
	getVoiceState: (userId: Guid) => VttVoiceState | undefined;
}

interface VttVoiceMessage {
	type: "ALBINA_VOICE_STATE";
	state: {
		discordId: string;
		inCall: boolean;
		speaking: boolean;
		muted: boolean;
		deafened: boolean;
	};
}

interface VttVoiceHeartbeat {
	type: "ALBINA_VOICE_HEARTBEAT";
	timestamp: number;
}

type VttVoiceIncomingMessage = VttVoiceMessage | VttVoiceHeartbeat;

interface VttVoiceIframeState {
	mounted: boolean;
	attempt: number;
}

interface VttVoiceHeartbeatTracking {
	discordId: string;
	lastHeartbeat: number;
	offlineSince: number | null;
	iframeMounted: boolean;
}

const VttVoiceStoreContext = createContext<StoreApi<VttVoiceStoreState> | null>(
	null,
);

interface VttVoiceContextProviderProps {
	children: ReactNode;
}

function createVttVoiceStore(): StoreApi<VttVoiceStoreState> {
	return createStore<VttVoiceStoreState>()((set, get) => ({
		voiceStates: new Map(),

		syncMembers: (userIds) => {
			const current = get().voiceStates;
			const next = new Map<Guid, VttVoiceState | undefined>();

			for (const userId of userIds) next.set(userId, current.get(userId));

			if (
				current.size === next.size &&
				[...current.keys()].every((id) => next.has(id))
			)
				return;

			set({ voiceStates: next });
		},

		setVoiceState: (userId, voiceState) => {
			const current = get().voiceStates;
			const previous = current.get(userId);

			if (
				previous?.inCall === voiceState?.inCall &&
				previous?.speaking === voiceState?.speaking &&
				previous?.muted === voiceState?.muted &&
				previous?.deafened === voiceState?.deafened
			)
				return;

			const next = new Map(current);
			next.set(userId, voiceState);

			set({ voiceStates: next });
		},

		getVoiceState: (userId) => get().voiceStates.get(userId),
	}));
}

function getDiscordId(
	member: CampaignMember,
	externalIds: Map<Guid, VttExternalIds>,
): string | undefined {
	const discordId = externalIds.get(member.userId)?.discord;

	return typeof discordId === "string" && discordId.length > 0
		? discordId
		: undefined;
}

export function VttVoiceContextProvider({
	children,
}: VttVoiceContextProviderProps) {
	const members = useVttMembersStore((state) => state.members);
	const externalIds = useVttMembersStore((state) => state.externalIds);
	const [store] = useState(() => createVttVoiceStore());
	const iframeRefs = useRef(new Map<Guid, HTMLIFrameElement>());
	const heartbeatTracking = useRef(new Map<Guid, VttVoiceHeartbeatTracking>());
	const [iframeStates, setIframeStates] = useState(
		() => new Map<Guid, VttVoiceIframeState>(),
	);

	const membersWithDiscord = useMemo(
		() =>
			members.filter(
				(member) => getDiscordId(member, externalIds) !== undefined,
			),
		[members, externalIds],
	);

	useEffect(() => {
		const userIds = membersWithDiscord.map((member) => member.userId);
		const currentUserIds = new Set(userIds);
		const now = Date.now();

		store.getState().syncMembers(userIds);

		for (const userId of heartbeatTracking.current.keys()) {
			if (currentUserIds.has(userId)) continue;

			heartbeatTracking.current.delete(userId);
			iframeRefs.current.delete(userId);
		}

		for (const member of membersWithDiscord) {
			const userId = member.userId;
			const discordId = getDiscordId(member, externalIds)!;
			const tracking = heartbeatTracking.current.get(userId);

			if (!tracking) {
				heartbeatTracking.current.set(userId, {
					discordId,
					lastHeartbeat: now,
					offlineSince: null,
					iframeMounted: true,
				});

				continue;
			}

			if (tracking.discordId === discordId) continue;

			tracking.discordId = discordId;
			tracking.lastHeartbeat = now;
			tracking.offlineSince = null;
			tracking.iframeMounted = true;

			store.getState().setVoiceState(userId, undefined);

			setIframeStates((current) => {
				const state = current.get(userId);
				const next = new Map(current);

				next.set(userId, {
					mounted: true,
					attempt: (state?.attempt ?? 0) + 1,
				});

				return next;
			});
		}

		setIframeStates((current) => {
			const next = new Map<Guid, VttVoiceIframeState>();

			for (const userId of userIds) {
				next.set(
					userId,
					current.get(userId) ?? {
						mounted: true,
						attempt: 0,
					},
				);
			}

			if (
				current.size === next.size &&
				[...current.keys()].every((id) => next.has(id))
			)
				return current;

			return next;
		});
	}, [membersWithDiscord, externalIds, store]);

	useEffect(() => {
		function handleMessage(event: MessageEvent) {
			if (event.origin !== REACTIVE_ORIGIN) return;

			const message = event.data as VttVoiceIncomingMessage;
			if (
				message?.type !== "ALBINA_VOICE_STATE" &&
				message?.type !== "ALBINA_VOICE_HEARTBEAT"
			)
				return;

			const member = membersWithDiscord.find((candidate) => {
				const iframe = iframeRefs.current.get(candidate.userId);
				return iframe?.contentWindow === event.source;
			});
			if (!member) return;

			const tracking = heartbeatTracking.current.get(member.userId);
			if (!tracking || !tracking.iframeMounted) return;

			if (message.type === "ALBINA_VOICE_HEARTBEAT") {
				if (
					typeof message.timestamp !== "number" ||
					!Number.isFinite(message.timestamp)
				)
					return;

				tracking.lastHeartbeat = Date.now();
				tracking.offlineSince = null;

				// console.debug(
				// 	"[Albina Voice] Heartbeat received:",
				// 	member.userId,
				// 	message.timestamp,
				// );

				return;
			}

			const state = message.state;
			if (
				typeof state?.discordId !== "string" ||
				typeof state?.inCall !== "boolean" ||
				typeof state?.speaking !== "boolean" ||
				typeof state?.muted !== "boolean" ||
				typeof state?.deafened !== "boolean"
			)
				return;
			if (state.discordId !== tracking.discordId) return;

			store.getState().setVoiceState(member.userId, {
				inCall: state.inCall,
				speaking: state.inCall && state.speaking,
				muted: state.inCall && state.muted,
				deafened: state.inCall && state.deafened,
			});
		}

		window.addEventListener("message", handleMessage);

		return () => window.removeEventListener("message", handleMessage);
	}, [membersWithDiscord, store]);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();

			for (const [userId, tracking] of heartbeatTracking.current) {
				if (tracking.iframeMounted) {
					if (now - tracking.lastHeartbeat <= HEARTBEAT_TIMEOUT) continue;

					tracking.iframeMounted = false;
					tracking.offlineSince = now;

					// console.warn(
					// 	"[Albina Voice] Heartbeat timeout. Destroying iframe:",
					// 	userId,
					// );

					store.getState().setVoiceState(userId, undefined);

					setIframeStates((current) => {
						const state = current.get(userId);
						if (!state || !state.mounted) return current;
						const next = new Map(current);
						next.set(userId, {
							...state,
							mounted: false,
						});
						return next;
					});

					continue;
				}

				if (tracking.offlineSince === null) continue;
				if (now - tracking.offlineSince < RELOAD_INTERVAL) continue;

				// console.warn(
				// 	"[Albina Voice] Offline for 60 seconds. Recreating iframe:",
				// 	userId,
				// );

				tracking.lastHeartbeat = now;
				tracking.offlineSince = null;
				tracking.iframeMounted = true;

				setIframeStates((current) => {
					const state = current.get(userId);
					if (!state || state.mounted) return current;

					const next = new Map(current);
					next.set(userId, {
						mounted: true,
						attempt: state.attempt + 1,
					});

					return next;
				});
			}
		}, MONITOR_INTERVAL);

		return () => clearInterval(interval);
	}, [store]);

	return (
		<VttVoiceStoreContext.Provider value={store}>
			{membersWithDiscord.map((member) => {
				const discordId = getDiscordId(member, externalIds);
				const iframeState = iframeStates.get(member.userId);

				if (!discordId || !iframeState?.mounted) return null;

				return (
					<iframe
						key={`${member.userId}-${discordId}-${iframeState.attempt}`}
						ref={(element) => {
							if (element) iframeRefs.current.set(member.userId, element);
							else iframeRefs.current.delete(member.userId);
						}}
						src={`${REACTIVE_URL}${discordId}`}
						title={`Voice integration ${member.userId}`}
						aria-hidden="true"
						tabIndex={-1}
						style={{
							position: "fixed",
							width: 1,
							height: 1,
							opacity: 0,
							pointerEvents: "none",
							visibility: "hidden",
							border: 0,
							overflow: "hidden",
						}}
					/>
				);
			})}

			{children}
		</VttVoiceStoreContext.Provider>
	);
}

export function useVttVoiceStoreApi(): StoreApi<VttVoiceStoreState> {
	const store = useContext(VttVoiceStoreContext);

	if (!store)
		throw new Error(
			"useVttVoiceStoreApi must be used inside a VttVoiceContextProvider.",
		);

	return store;
}

export function useVttVoiceStore<T>(
	selector: (state: VttVoiceStoreState) => T,
): T {
	return useStore(useVttVoiceStoreApi(), selector);
}
