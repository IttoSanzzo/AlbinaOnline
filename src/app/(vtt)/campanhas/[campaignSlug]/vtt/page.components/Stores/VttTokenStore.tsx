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
	/** All VttToken IDs in the current VTT */
	tokenIds: Guid[];
	/** Token IDs indexed by scene ID, ordered by rendering priority */
	tokenIdsPerScene: Map<Guid, Guid[]>;
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

function createTokenIdsPerScene(tokens: Iterable<VttToken>): Map<Guid, Guid[]> {
	const tokenIdsPerScene = new Map<Guid, Guid[]>();
	for (const token of tokens) {
		for (const sceneId of token.placements.keys()) {
			let tokenIds = tokenIdsPerScene.get(sceneId);
			if (!tokenIds) {
				tokenIds = [];
				tokenIdsPerScene.set(sceneId, tokenIds);
			}
			tokenIds.push(token.id);
		}
	}
	return tokenIdsPerScene;
}

function hasSamePlacementScenes(
	previousToken?: VttToken,
	nextToken?: VttToken,
): boolean {
	if (previousToken === nextToken) return true;
	if (!previousToken || !nextToken) return false;
	if (previousToken.placements.size !== nextToken.placements.size) return false;

	for (const sceneId of previousToken.placements.keys()) {
		if (!nextToken.placements.has(sceneId)) return false;
	}

	return true;
}

function syncTokenSceneIndex(
	tokenIdsPerScene: Map<Guid, Guid[]>,
	tokenId: Guid,
	previousToken?: VttToken,
	nextToken?: VttToken,
): void {
	if (previousToken) {
		for (const sceneId of previousToken.placements.keys()) {
			if (nextToken?.placements.has(sceneId)) continue;
			const existingIds = tokenIdsPerScene.get(sceneId);
			if (!existingIds) continue;
			const tokenIds = existingIds.filter((id) => id !== tokenId);
			if (tokenIds.length === 0) tokenIdsPerScene.delete(sceneId);
			else tokenIdsPerScene.set(sceneId, tokenIds);
		}
	}
	if (nextToken) {
		for (const sceneId of nextToken.placements.keys()) {
			if (previousToken?.placements.has(sceneId)) continue;
			const tokenIds = [...(tokenIdsPerScene.get(sceneId) ?? []), tokenId];
			tokenIdsPerScene.set(sceneId, tokenIds);
		}
	}
}

function hasChangedPlacementCoordinates(
	previousToken: VttToken | undefined,
	nextToken: VttToken,
): Guid[] {
	if (!previousToken) return [];
	const changedSceneIds: Guid[] = [];
	for (const [sceneId, placement] of nextToken.placements) {
		const previousPlacement = previousToken.placements.get(sceneId);
		if (
			previousPlacement &&
			(previousPlacement.x !== placement.x ||
				previousPlacement.y !== placement.y)
		)
			changedSceneIds.push(sceneId);
	}
	return changedSceneIds;
}

function canPromoteTokenInScene(
	tokenIdsPerScene: Map<Guid, Guid[]>,
	tokenId: Guid,
	sceneId: Guid,
): boolean {
	const tokenIds = tokenIdsPerScene.get(sceneId);
	if (!tokenIds) return false;
	const index = tokenIds.indexOf(tokenId);
	return index !== -1 && index !== tokenIds.length - 1;
}

function promoteTokenInScene(
	tokenIdsPerScene: Map<Guid, Guid[]>,
	tokenId: Guid,
	sceneId: Guid,
): boolean {
	const existingIds = tokenIdsPerScene.get(sceneId);
	if (!existingIds) return false;

	const index = existingIds.indexOf(tokenId);
	if (index === -1 || index === existingIds.length - 1) return false;

	const tokenIds = [...existingIds];
	tokenIds.splice(index, 1);
	tokenIds.push(tokenId);
	tokenIdsPerScene.set(sceneId, tokenIds);
	return true;
}

function setToken(
	state: VttTokenStoreState,
	token: VttToken,
): Partial<VttTokenStoreState> {
	const previousToken = state.tokens.get(token.id);
	const tokens = new Map(state.tokens);
	tokens.set(token.id, token);

	let tokenIdsPerScene = state.tokenIdsPerScene;
	if (!hasSamePlacementScenes(previousToken, token)) {
		tokenIdsPerScene = new Map(state.tokenIdsPerScene);
		syncTokenSceneIndex(tokenIdsPerScene, token.id, previousToken, token);
	}

	return { tokens, tokenIdsPerScene };
}

function updateToken(
	state: VttTokenStoreState,
	id: Guid,
	update: (token: VttToken) => VttToken,
): Partial<VttTokenStoreState> {
	const token = state.tokens.get(id);
	if (!token) return {};
	const updatedToken = update(token);
	if (updatedToken === token) return {};
	return setToken(state, updatedToken);
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
		tokenIds: [],
		tokenIdsPerScene: new Map(),
		activeDrags: new Map(),

		replaceAll: (items) => {
			const tokens = new Map(items.map((item) => [item.id, item]));
			set({
				tokens,
				tokenIds: [...tokens.keys()],
				tokenIdsPerScene: createTokenIdsPerScene(tokens.values()),
				activeDrags: new Map(),
			});
		},

		add: (token) =>
			set((state) => {
				const isNewToken = !state.tokens.has(token.id);
				return {
					...setToken(state, token),
					...(isNewToken && {
						tokenIds: [...state.tokenIds, token.id],
					}),
				};
			}),

		update: (token) =>
			set((state) => {
				const previousToken = state.tokens.get(token.id);
				const updatedState = setToken(state, token);
				const changedSceneIds = hasChangedPlacementCoordinates(
					previousToken,
					token,
				);
				if (changedSceneIds.length === 0) return updatedState;
				let tokenIdsPerScene =
					updatedState.tokenIdsPerScene ?? state.tokenIdsPerScene;
				let orderChanged = false;
				for (const sceneId of changedSceneIds) {
					if (!canPromoteTokenInScene(tokenIdsPerScene, token.id, sceneId))
						continue;
					if (!orderChanged) {
						tokenIdsPerScene = new Map(tokenIdsPerScene);
						orderChanged = true;
					}
					promoteTokenInScene(tokenIdsPerScene, token.id, sceneId);
				}
				return orderChanged
					? { ...updatedState, tokenIdsPerScene }
					: updatedState;
			}),

		remove: (id) =>
			set((state) => {
				const previousToken = state.tokens.get(id);
				if (!previousToken) return state;
				const tokens = new Map(state.tokens);
				const tokenIds = state.tokenIds.filter((tokenId) => tokenId !== id);
				const tokenIdsPerScene = new Map(state.tokenIdsPerScene);
				const activeDrags = new Map(state.activeDrags);
				syncTokenSceneIndex(tokenIdsPerScene, id, previousToken);
				tokens.delete(id);
				activeDrags.delete(id);
				return { tokens, tokenIds, tokenIdsPerScene, activeDrags };
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

				const token = state.tokens.get(id);
				const placement = token?.placements.get(sceneId);
				const positionChanged =
					!!placement &&
					(drag.initialCoordinates.x !== coordinates.x ||
						drag.initialCoordinates.y !== coordinates.y);

				const updatedState = updateToken(
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

				const tokenIdsPerScene =
					updatedState.tokenIdsPerScene ?? state.tokenIdsPerScene;

				if (
					!positionChanged ||
					!canPromoteTokenInScene(tokenIdsPerScene, id, sceneId)
				)
					return { ...updatedState, activeDrags };
				const updatedTokenIdsPerScene = new Map(tokenIdsPerScene);
				promoteTokenInScene(updatedTokenIdsPerScene, id, sceneId);
				return {
					...updatedState,
					tokenIdsPerScene: updatedTokenIdsPerScene,
					activeDrags,
				};
			}),

		cancelDrag: (id, sceneId) =>
			set((state) => {
				const drag = state.activeDrags.get(id);
				if (!drag || drag.sceneId !== sceneId) return state;

				const activeDrags = new Map(state.activeDrags);
				activeDrags.delete(id);

				return {
					...updateToken(
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
					),
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
