"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { createStore, StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttToken } from "../Types/Classes/VttToken";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";

interface VttTokenDragState {
	sceneId: Guid;
	initialCoordinates: CoordinatePair;
}

interface VttTokenStoreState {
	/** All VttTokens in the current VTT */
	tokens: Map<Guid, VttToken>;
	/** Token IDs indexed by scene ID */
	tokenIdsPerScene: Map<Guid, Set<Guid>>;
	/** Coordinates captured when each token started dragging */
	activeDrags: Map<Guid, VttTokenDragState>;
	/** Replaces all VttTokens */
	replaceAll: (tokens: VttToken[]) => void;
	/** Adds a VttToken */
	add: (token: VttToken) => void;
	/** Updates a VttToken */
	update: (token: VttToken) => void;
	/** Removes a VttToken */
	remove: (id: Guid) => void;
	/** Registers a VttToken element drag start */
	startDrag: (id: Guid, resourceLock: VttResourceLockDto) => void;
	/** Registers a VttToken element drag update */
	updateDrag: (id: Guid, sceneId: Guid, coordinates: CoordinatePair) => void;
	/** Registers a VttToken element drag end */
	endDrag: (id: Guid, sceneId: Guid, coordinates: CoordinatePair) => void;
	/** Registers a VttToken element drag cancellation */
	cancelDrag: (id: Guid, sceneId: Guid) => void;
}

type VttTokenStore = StoreApi<VttTokenStoreState>;

const VttTokenStoreContext = createContext<VttTokenStore | null>(null);

function createTokenIdsPerScene(
	tokens: Iterable<VttToken>,
): Map<Guid, Set<Guid>> {
	const tokenIdsPerScene = new Map<Guid, Set<Guid>>();
	for (const token of tokens) {
		for (const sceneId of token.placements.keys()) {
			let tokenIds = tokenIdsPerScene.get(sceneId);
			if (!tokenIds) {
				tokenIds = new Set<Guid>();
				tokenIdsPerScene.set(sceneId, tokenIds);
			}
			tokenIds.add(token.id);
		}
	}
	return tokenIdsPerScene;
}

function syncTokenSceneIndex(
	tokenIdsPerScene: Map<Guid, Set<Guid>>,
	tokenId: Guid,
	previousToken?: VttToken,
	nextToken?: VttToken,
): void {
	if (previousToken) {
		for (const sceneId of previousToken.placements.keys()) {
			const existingIds = tokenIdsPerScene.get(sceneId);
			if (!existingIds?.has(tokenId)) continue;
			const tokenIds = new Set(existingIds);
			tokenIds.delete(tokenId);
			if (tokenIds.size === 0) tokenIdsPerScene.delete(sceneId);
			else tokenIdsPerScene.set(sceneId, tokenIds);
		}
	}
	if (nextToken) {
		for (const sceneId of nextToken.placements.keys()) {
			const tokenIds = new Set(tokenIdsPerScene.get(sceneId) ?? []);
			tokenIds.add(tokenId);
			tokenIdsPerScene.set(sceneId, tokenIds);
		}
	}
}

function updatePlacementCoordinates(
	tokens: Map<Guid, VttToken>,
	tokenId: Guid,
	sceneId: Guid,
	coordinates: CoordinatePair,
): Map<Guid, VttToken> {
	const token = tokens.get(tokenId);
	const placement = token?.placements.get(sceneId);
	if (!token || !placement) return tokens;
	const updatedToken = {
		...token,
		placements: new Map(token.placements).set(sceneId, {
			...placement,
			coordinates,
		}),
	};
	const updatedTokens = new Map(tokens);
	updatedTokens.set(tokenId, updatedToken);
	return updatedTokens;
}

function createVttTokenStore(): VttTokenStore {
	return createStore<VttTokenStoreState>()((set) => ({
		tokens: new Map(),
		tokenIdsPerScene: new Map(),
		activeDrags: new Map(),

		replaceAll: (items) => {
			const tokens = new Map(items.map((item) => [item.id, item]));
			set({
				tokens,
				tokenIdsPerScene: createTokenIdsPerScene(tokens.values()),
				activeDrags: new Map(),
			});
		},

		add: (token) =>
			set((state) => {
				const tokens = new Map(state.tokens);
				const tokenIdsPerScene = new Map(state.tokenIdsPerScene);
				const previousToken = tokens.get(token.id);
				syncTokenSceneIndex(tokenIdsPerScene, token.id, previousToken, token);
				tokens.set(token.id, token);
				return { tokens, tokenIdsPerScene };
			}),

		update: (token) =>
			set((state) => {
				const tokens = new Map(state.tokens);
				const tokenIdsPerScene = new Map(state.tokenIdsPerScene);
				const previousToken = tokens.get(token.id);
				syncTokenSceneIndex(tokenIdsPerScene, token.id, previousToken, token);
				tokens.set(token.id, token);
				return { tokens, tokenIdsPerScene };
			}),

		remove: (id) =>
			set((state) => {
				const previousToken = state.tokens.get(id);
				if (!previousToken) return state;
				const tokens = new Map(state.tokens);
				const tokenIdsPerScene = new Map(state.tokenIdsPerScene);
				const activeDrags = new Map(state.activeDrags);
				syncTokenSceneIndex(tokenIdsPerScene, id, previousToken);
				tokens.delete(id);
				activeDrags.delete(id);
				return { tokens, tokenIdsPerScene, activeDrags };
			}),

		startDrag: (id, resourceLock) =>
			set((state) => {
				const placement = state.tokens
					.get(id)
					?.placements.get(resourceLock.sceneId);
				if (!placement || state.activeDrags.has(id)) return state;
				const activeDrags = new Map(state.activeDrags);
				activeDrags.set(id, {
					sceneId: resourceLock.sceneId,
					initialCoordinates: { ...placement.coordinates },
				});
				return { activeDrags };
			}),

		updateDrag: (id, sceneId, coordinates) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;
				const tokens = updatePlacementCoordinates(
					state.tokens,
					id,
					sceneId,
					coordinates,
				);
				if (tokens === state.tokens) return state;
				return { tokens };
			}),

		endDrag: (id, sceneId, coordinates) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (drag && drag.sceneId !== sceneId) return state;
				const tokens = updatePlacementCoordinates(
					state.tokens,
					id,
					sceneId,
					coordinates,
				);
				const activeDrags = new Map(state.activeDrags);
				activeDrags.delete(id);
				return {
					...(tokens !== state.tokens ? { tokens } : {}),
					activeDrags,
				};
			}),

		cancelDrag: (id, sceneId) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;
				const tokens = updatePlacementCoordinates(
					state.tokens,
					id,
					sceneId,
					drag.initialCoordinates,
				);
				const activeDrags = new Map(state.activeDrags);
				activeDrags.delete(id);
				return {
					...(tokens !== state.tokens ? { tokens } : {}),
					activeDrags,
				};
			}),
	}));
}

interface VttTokenStoreProviderProps {
	children: ReactNode;
}

export function VttTokenStoreProvider({
	children,
}: VttTokenStoreProviderProps) {
	const [store] = useState(createVttTokenStore);

	return (
		<VttTokenStoreContext.Provider value={store}>
			{children}
		</VttTokenStoreContext.Provider>
	);
}

export function useVttTokenStore<T>(
	selector: (state: VttTokenStoreState) => T,
): T {
	const store = useContext(VttTokenStoreContext);
	if (!store)
		throw new Error(
			"useVttTokenStore must be used inside VttTokenStoreProvider.",
		);
	return useStore(store, selector);
}
