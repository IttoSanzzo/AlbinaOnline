"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { createStore, StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import { VttGridMap } from "../Types/Classes/VttGridMap";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";

interface VttGridMapStoreState {
	/** Map for all VttGridMaps in the current scene */
	gridMaps: Map<Guid, VttGridMap>;
	/** Order to render each VttGridMap present in the current scene */
	order: Guid[];
	/** Replaces all VttGridMaps */
	replaceAll: (gridMaps: VttGridMap[]) => void;
	/** Adds a VttGridMap */
	add: (gridMap: VttGridMap) => void;
	/** Updates a VttGridMap */
	update: (gridMap: VttGridMap) => void;
	/** Removes a VttGridMap */
	remove: (id: Guid) => void;
	/** Registers a VttGridMap element drag start */
	startDrag: (id: Guid, resourceLock: VttResourceLockDto) => void;
	/** Registers a VttGridMap element drag update */
	updateDrag: (id: Guid, coordinates: CoordinatePair) => void;
	/** Registers a VttGridMap element drag end */
	endDrag: (id: Guid, coordinates: CoordinatePair) => void;
	/** Registers a VttGridMap element drag cancellation */
	cancelDrag: (id: Guid, coordinates: CoordinatePair) => void;
	/** Brings a VttGridMap to the top of the render order */
	bringUp: (id: Guid) => void;
}

type VttGridMapStore = StoreApi<VttGridMapStoreState>;

const VttGridMapStoreContext = createContext<VttGridMapStore | null>(null);

function removeDragLock(gridMap: VttGridMap): VttGridMap {
	return {
		...gridMap,
		resourceLocks: gridMap.resourceLocks.filter(
			(lock) => lock.lockType !== "drag",
		),
	};
}

function updateGridMap(
	state: VttGridMapStoreState,
	id: Guid,
	update: (gridMap: VttGridMap) => VttGridMap,
): Partial<VttGridMapStoreState> {
	const gridMap = state.gridMaps.get(id);
	if (!gridMap) return {};

	const gridMaps = new Map(state.gridMaps);
	gridMaps.set(id, update(gridMap));
	return { gridMaps };
}

function createVttGridMapStore(): VttGridMapStore {
	return createStore<VttGridMapStoreState>()((set) => ({
		gridMaps: new Map(),
		order: [],

		replaceAll: (items) => {
			const sorted = items.toSorted(
				(a, b) =>
					new Date(a.updatedAt ?? a.createdAt).getTime() -
					new Date(b.updatedAt ?? b.createdAt).getTime(),
			);
			set({
				gridMaps: new Map(sorted.map((item) => [item.id, item])),
				order: sorted.map((item) => item.id),
			});
		},

		add: (gridMap) =>
			set((state) => {
				const gridMaps = new Map(state.gridMaps);
				const isNew = !gridMaps.has(gridMap.id);
				gridMaps.set(gridMap.id, gridMap);
				return {
					gridMaps,
					...(isNew ? { order: [...state.order, gridMap.id] } : {}),
				};
			}),

		update: (gridMap) =>
			set((state) => {
				const gridMaps = new Map(state.gridMaps);
				gridMaps.set(gridMap.id, gridMap);
				return {
					gridMaps,
					...(state.order[state.order.length - 1] != gridMap.id
						? {
								order: [
									...state.order.filter((id) => id !== gridMap.id),
									gridMap.id,
								],
							}
						: {}),
				};
			}),

		remove: (id) =>
			set((state) => {
				if (!state.gridMaps.has(id)) return state;
				const gridMaps = new Map(state.gridMaps);
				gridMaps.delete(id);
				return {
					gridMaps,
					order: state.order.filter((itemId) => itemId !== id),
				};
			}),

		startDrag: (id, resourceLock) =>
			set((state) =>
				updateGridMap(state, id, (gridMap) => ({
					...gridMap,
					resourceLocks: [
						...gridMap.resourceLocks.filter(
							(lock) => lock.lockType !== resourceLock.lockType,
						),
						resourceLock,
					],
				})),
			),

		updateDrag: (id, coordinates) =>
			set((state) =>
				updateGridMap(state, id, (gridMap) => ({
					...gridMap,
					coordinates,
				})),
			),

		endDrag: (id, coordinates) =>
			set((state) => ({
				...updateGridMap(state, id, (gridMap) =>
					removeDragLock({ ...gridMap, coordinates }),
				),
				...(state.gridMaps.has(id) && state.order[state.order.length - 1] != id
					? {
							order: [...state.order.filter((itemId) => itemId !== id), id],
						}
					: {}),
			})),

		cancelDrag: (id, coordinates) =>
			set((state) =>
				updateGridMap(state, id, (gridMap) =>
					removeDragLock({ ...gridMap, coordinates }),
				),
			),

		bringUp: (id) =>
			set((state) => ({
				order: state.gridMaps.has(id)
					? [...state.order.filter((itemId) => itemId !== id), id]
					: state.order,
			})),
	}));
}

interface VttGridMapStoreProviderProps {
	children: ReactNode;
}

export function VttGridMapStoreProvider({
	children,
}: VttGridMapStoreProviderProps) {
	const [store] = useState(createVttGridMapStore);

	return (
		<VttGridMapStoreContext.Provider value={store}>
			{children}
		</VttGridMapStoreContext.Provider>
	);
}

export function useVttGridMapStore<T>(
	selector: (state: VttGridMapStoreState) => T,
): T {
	const store = useContext(VttGridMapStoreContext);
	if (!store)
		throw new Error(
			"useVttGridMapStore must be used inside VttGridMapStoreProvider.",
		);
	return useStore(store, selector);
}
