"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { createStore, StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttToken } from "../Types/Classes/VttToken";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";
import { VttLockableResource } from "../Types/Classes/VttLockableResouce";

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

function updateToken(
	state: VttTokenStoreState,
	id: Guid,
	update: (token: VttToken) => VttToken,
): Partial<VttTokenStoreState> {
	const token = state.tokens.get(id);
	if (!token) return {};
	const updatedToken = update(token);
	const tokens = new Map(state.tokens);
	tokens.set(id, updatedToken);
	const tokenIdsPerScene = new Map(state.tokenIdsPerScene);
	syncTokenSceneIndex(tokenIdsPerScene, id, token, updatedToken);
	return { tokens, tokenIdsPerScene };
}

function updatePlacementCoordinates(
	state: VttTokenStoreState,
	tokenId: Guid,
	sceneId: Guid,
	coordinates: CoordinatePair,
): Partial<VttTokenStoreState> {
	return updateToken(state, tokenId, (token) => {
		const placement = token.placements.get(sceneId);
		if (!placement) return token;

		const placements = new Map(token.placements);
		placements.set(sceneId, {
			...placement,
			x: coordinates.x,
			y: coordinates.y,
		});

		return { ...token, placements };
	});
}

function isSameResourceLock(
	lock: VttLockableResource,
	resourceLock: VttResourceLockDto,
): boolean {
	return (
		lock.targetType === resourceLock.targetType &&
		lock.targetId === resourceLock.targetId &&
		lock.lockType === resourceLock.lockType &&
		lock.userId === resourceLock.userId &&
		lock.sceneId === resourceLock.sceneId
	);
}

function removeDragLock(
	token: VttToken,
	tokenId: Guid,
	sceneId: Guid,
): VttToken {
	return {
		...token,
		resourceLocks: token.resourceLocks.filter(
			(lock) =>
				!(
					lock.targetType === "VttToken" &&
					lock.targetId === tokenId &&
					lock.lockType === "drag" &&
					lock.sceneId === sceneId
				),
		),
	};
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
				const token = state.tokens.get(id);
				const placement = token?.placements.get(resourceLock.sceneId);

				if (
					!token ||
					!placement ||
					resourceLock.targetType !== "VttToken" ||
					resourceLock.targetId !== id ||
					resourceLock.lockType !== "drag" ||
					state.activeDrags.has(id)
				)
					return state;

				const activeDrags = new Map(state.activeDrags);
				activeDrags.set(id, {
					sceneId: resourceLock.sceneId,
					initialCoordinates: {
						x: placement.x,
						y: placement.y,
					},
				});

				return {
					...updateToken(state, id, (currentToken) => ({
						...currentToken,
						resourceLocks: [
							...currentToken.resourceLocks.filter(
								(lock) => !isSameResourceLock(lock, resourceLock),
							),
							resourceLock,
						],
					})),
					activeDrags,
				};
			}),

		updateDrag: (id, sceneId, coordinates) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;

				return updatePlacementCoordinates(state, id, sceneId, coordinates);
			}),

		endDrag: (id, sceneId, coordinates) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;

				const activeDrags = new Map(state.activeDrags);
				activeDrags.delete(id);

				return updateToken(
					{
						...state,
						activeDrags,
					},
					id,
					(token) => {
						const placement = token.placements.get(sceneId);
						if (!placement) return removeDragLock(token, id, sceneId);

						const placements = new Map(token.placements);
						placements.set(sceneId, {
							...placement,
							x: coordinates.x,
							y: coordinates.y,
						});

						return removeDragLock({ ...token, placements }, id, sceneId);
					},
				);
			}),

		cancelDrag: (id, sceneId) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;

				const activeDrags = new Map(state.activeDrags);
				activeDrags.delete(id);

				return updateToken(
					{
						...state,
						activeDrags,
					},
					id,
					(token) => {
						const placement = token.placements.get(sceneId);
						if (!placement) return removeDragLock(token, id, sceneId);

						const placements = new Map(token.placements);
						placements.set(sceneId, {
							...placement,
							x: drag.initialCoordinates.x,
							y: drag.initialCoordinates.y,
						});

						return removeDragLock({ ...token, placements }, id, sceneId);
					},
				);
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
