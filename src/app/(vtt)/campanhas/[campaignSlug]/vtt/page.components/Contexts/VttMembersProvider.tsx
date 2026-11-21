"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { CampaignMember, Guid } from "@/libs/stp@types";
import { useVttContext } from "./VttContextProvider";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { createStore, StoreApi, useStore } from "zustand";

export interface VttExternalIds {
	discord?: string;
}

export interface VttMembersState {
	members: CampaignMember[];
	connectedUserIds: Set<Guid>;
	externalIds: Map<Guid, VttExternalIds>;

	setMembers: (members: CampaignMember[]) => void;
	setConnectedUserIds: (userIds: Set<Guid>) => void;
	setExternalIds: (externalIds: Map<Guid, VttExternalIds>) => void;
	isUserConnected: (userId: Guid) => boolean;
}

const VttMembersStoreContext = createContext<StoreApi<VttMembersState> | null>(
	null,
);

interface VttMembersContextProviderProps {
	children: ReactNode;
}

function createVttMembersStore(): StoreApi<VttMembersState> {
	return createStore<VttMembersState>()((set, get) => ({
		members: [],
		connectedUserIds: new Set(),
		externalIds: new Map(),
		setMembers: (members) => set({ members }),
		setConnectedUserIds: (connectedUserIds) => {
			const current = get().connectedUserIds;

			if (
				current.size === connectedUserIds.size &&
				[...current].every((id) => connectedUserIds.has(id))
			)
				return;

			set({ connectedUserIds });
		},
		setExternalIds: (externalIds) => set({ externalIds }),
		isUserConnected: (userId) => get().connectedUserIds.has(userId),
	}));
}

export function VttMembersContextProvider({
	children,
}: VttMembersContextProviderProps) {
	const vttId = useVttContext((state) => state.vttId);
	const campaign = useVttContext((state) => state.campaign);
	const subscribe = useVttContext((state) => state.subscribe);

	const [store] = useState(() => createVttMembersStore());

	useEffect(() => {
		if (!vttId) return;

		store.getState().setMembers([]);
		store.getState().setConnectedUserIds(new Set());

		const controller = new AbortController();

		(async () => {
			try {
				const response = await fetch(
					getAlbinaApiFullAddress(
						`/campaigns/${campaign.slug}/members?expandUser=true`,
					),
					{ signal: controller.signal },
				);
				if (!response.ok) return;

				const members: CampaignMember[] = await response.json();
				if (controller.signal.aborted) return;

				store.getState().setMembers(members);
				const currentExternalIds = store.getState().externalIds;
				const memberIds = new Set(members.map((member) => member.userId));
				const externalIds = new Map<Guid, VttExternalIds>(
					[...currentExternalIds].filter(([userId]) => memberIds.has(userId)),
				);

				const membersWithoutDiscord = members.filter((member) => {
					const discordId = externalIds.get(member.userId)?.discord;
					return typeof discordId !== "string" || discordId.length === 0;
				});

				await Promise.all(
					membersWithoutDiscord.map(async (member) => {
						try {
							const response = await fetch(
								getAlbinaApiFullAddress(
									`/users/id/${member.userId}/external/discord`,
								),
								{ signal: controller.signal },
							);
							if (!response.ok) return;

							const discordId: unknown = await response.json();
							if (typeof discordId !== "string" || !discordId.length) return;

							externalIds.set(member.userId, {
								...externalIds.get(member.userId),
								discord: discordId,
							});
						} catch (error) {
							if (!controller.signal.aborted)
								console.error(
									`[VTT Members] Failed to fetch Discord ID for ${member.userId}:`,
									error,
								);
						}
					}),
				);

				if (controller.signal.aborted) return;

				store.getState().setExternalIds(externalIds);
			} catch (error) {
				if (!controller.signal.aborted)
					console.error(
						"[VTT Members] Failed to load campaign members:",
						error,
					);
			}
		})();

		const unsubscribe = subscribe("ConnectedUserIds", (message) => {
			store.getState().setConnectedUserIds(new Set(message.data as Guid[]));
		});

		return () => {
			controller.abort();
			unsubscribe();
		};
	}, [vttId, campaign.slug, subscribe, store]);

	return (
		<VttMembersStoreContext.Provider value={store}>
			{children}
		</VttMembersStoreContext.Provider>
	);
}

export function useVttMembersStoreApi(): StoreApi<VttMembersState> {
	const store = useContext(VttMembersStoreContext);

	if (!store)
		throw new Error(
			"useVttMembersStoreApi must be used inside a VttMembersContextProvider.",
		);

	return store;
}

export function useVttMembersStore<T>(
	selector: (state: VttMembersState) => T,
): T {
	return useStore(useVttMembersStoreApi(), selector);
}

/**
 * Compatibility hook. Prefer passing a selector for granular subscriptions.
 */
export function useVttMembersContext(): VttMembersState;

export function useVttMembersContext<T>(
	selector: (state: VttMembersState) => T,
): T;

export function useVttMembersContext<T>(
	selector?: (state: VttMembersState) => T,
): T | VttMembersState {
	const store = useVttMembersStoreApi();

	const resolvedSelector: (state: VttMembersState) => T | VttMembersState =
		selector ?? ((state) => state);

	return useStore(store, resolvedSelector);
}
