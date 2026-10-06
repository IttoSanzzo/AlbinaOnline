"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useSyncExternalStore,
} from "react";
import { useVttViewportContext } from "./VttViewportContextProvider";

type VttViewportContextValue = ReturnType<typeof useVttViewportContext>;

interface VttThrottledViewportStore {
	value: VttViewportContextValue;
	subscribe: (throttleMs: number, listener: () => void) => () => void;
}

const VttThrottledViewportContext =
	createContext<VttThrottledViewportStore | null>(null);

class ThrottledViewportSubscription {
	private listener: () => void;
	private throttleMs: number;
	private timeout: ReturnType<typeof setTimeout> | null = null;
	private lastUpdateAt = 0;
	private pending = false;

	constructor(throttleMs: number, listener: () => void) {
		this.throttleMs = Math.max(0, throttleMs);
		this.listener = listener;
	}

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
	const viewportContext = useVttViewportContext();

	const viewportRef = useRef(viewportContext);
	const subscriptionsRef = useRef(new Set<ThrottledViewportSubscription>());

	viewportRef.current = viewportContext;

	useEffect(() => {
		for (const subscription of subscriptionsRef.current) subscription.notify();
	}, [viewportContext]);

	useEffect(() => {
		return () => {
			for (const subscription of subscriptionsRef.current)
				subscription.dispose();

			subscriptionsRef.current.clear();
		};
	}, []);

	const store = useMemo<VttThrottledViewportStore>(
		() => ({
			get value() {
				return viewportRef.current;
			},
			subscribe: (throttleMs, listener) => {
				const subscription = new ThrottledViewportSubscription(
					throttleMs,
					listener,
				);

				subscriptionsRef.current.add(subscription);

				return () => {
					subscription.dispose();
					subscriptionsRef.current.delete(subscription);
				};
			},
		}),
		[],
	);

	return (
		<VttThrottledViewportContext.Provider value={store}>
			{children}
		</VttThrottledViewportContext.Provider>
	);
}

export function useVttThrottledViewportContext(
	throttleMs: number = 100,
): VttViewportContextValue {
	const store = useContext(VttThrottledViewportContext);

	if (!store)
		throw new Error(
			"useVttThrottledViewportContext must be used inside a VttThrottledViewportContextProvider.",
		);

	const subscribe = useMemo(
		() => (listener: () => void) => {
			return store.subscribe(throttleMs, listener);
		},
		[store, throttleMs],
	);

	const getSnapshot = () => store.value;

	return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
