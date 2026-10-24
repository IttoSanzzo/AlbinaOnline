"use client";

import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useSyncExternalStore,
} from "react";
import { StoreApi } from "zustand";
import {
	useVttViewportStoreApi,
	VttViewportState,
} from "./VttViewportContextProvider";

interface VttThrottledViewportStore {
	value: StoreApi<VttViewportState>;
	subscribe: (throttleMs: number, listener: () => void) => () => void;
}

const VttThrottledViewportStoreContext =
	createContext<VttThrottledViewportStore | null>(null);

class ThrottledViewportSubscription {
	private timeout: ReturnType<typeof setTimeout> | null = null;
	private lastUpdateAt = 0;
	private pending = false;

	constructor(
		private readonly throttleMs: number,
		private readonly listener: () => void,
	) {}

	public notify() {
		if (this.throttleMs === 0) {
			this.lastUpdateAt = performance.now();
			this.listener();
			return;
		}

		const now = performance.now();
		const elapsed = now - this.lastUpdateAt;

		if (elapsed >= this.throttleMs) {
			this.lastUpdateAt = now;
			this.pending = false;
			this.listener();
			return;
		}

		this.pending = true;
		if (this.timeout !== null) return;

		this.timeout = setTimeout(() => {
			this.timeout = null;
			if (!this.pending) return;

			this.pending = false;
			this.lastUpdateAt = performance.now();
			this.listener();
		}, this.throttleMs - elapsed);
	}

	public dispose() {
		if (this.timeout !== null) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}

		this.pending = false;
	}
}

interface VttThrottledViewportContextProviderProps {
	children: ReactNode;
}

export function VttThrottledViewportContextProvider({
	children,
}: VttThrottledViewportContextProviderProps) {
	const viewportStore = useVttViewportStoreApi();
	const subscriptionsRef = useRef(new Set<ThrottledViewportSubscription>());

	useEffect(() => {
		const unsubscribe = viewportStore.subscribe(() => {
			for (const subscription of subscriptionsRef.current)
				subscription.notify();
		});

		return () => {
			unsubscribe();

			for (const subscription of subscriptionsRef.current)
				subscription.dispose();

			subscriptionsRef.current.clear();
		};
	}, [viewportStore]);

	const store = useMemo<VttThrottledViewportStore>(
		() => ({
			value: viewportStore,
			subscribe: (throttleMs, listener) => {
				const subscription = new ThrottledViewportSubscription(
					Math.max(0, throttleMs),
					listener,
				);

				subscriptionsRef.current.add(subscription);

				return () => {
					subscription.dispose();
					subscriptionsRef.current.delete(subscription);
				};
			},
		}),
		[viewportStore],
	);

	return (
		<VttThrottledViewportStoreContext.Provider value={store}>
			{children}
		</VttThrottledViewportStoreContext.Provider>
	);
}

type ViewportSelector<T> = (state: VttViewportState) => T;
type EqualityFn<T> = (previous: T, next: T) => boolean;

const identitySelector: ViewportSelector<VttViewportState> = (state) => state;

export function useVttThrottledViewportContext(
	throttleMs?: number,
): VttViewportState;

export function useVttThrottledViewportContext<T>(
	selector: ViewportSelector<T>,
	throttleMs?: number,
	equalityFn?: EqualityFn<T>,
): T;

export function useVttThrottledViewportContext<T>(
	selectorOrThrottle: ViewportSelector<T> | number = 100,
	throttleMs = 100,
	equalityFn: EqualityFn<T> = Object.is,
): T | VttViewportState {
	const store = useContext(VttThrottledViewportStoreContext);

	if (!store)
		throw new Error(
			"useVttThrottledViewportContext must be used inside a VttThrottledViewportContextProvider.",
		);

	const hasSelector = typeof selectorOrThrottle === "function";

	const selector: ViewportSelector<T | VttViewportState> = hasSelector
		? (selectorOrThrottle as ViewportSelector<T>)
		: identitySelector;

	const actualThrottleMs =
		typeof selectorOrThrottle === "number" ? selectorOrThrottle : throttleMs;

	const cacheRef = useRef<{
		state: VttViewportState;
		selector: ViewportSelector<T | VttViewportState>;
		selection: T | VttViewportState;
	} | null>(null);

	const subscribe = useCallback(
		(listener: () => void) => store.subscribe(actualThrottleMs, listener),
		[store, actualThrottleMs],
	);

	const getSnapshot = useCallback(() => {
		const state = store.value.getState();
		const cached = cacheRef.current;

		if (cached?.state === state && cached.selector === selector)
			return cached.selection;

		const nextSelection = selector(state);

		if (
			cached &&
			cached.selector === selector &&
			(hasSelector
				? equalityFn(cached.selection as T, nextSelection as T)
				: Object.is(cached.selection, nextSelection))
		) {
			cacheRef.current = {
				state,
				selector,
				selection: cached.selection,
			};
			return cached.selection;
		}

		cacheRef.current = {
			state,
			selector,
			selection: nextSelection,
		};

		return nextSelection;
	}, [store, selector, hasSelector, equalityFn]);

	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
