"use client";

import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { Campaign, Guid } from "@/libs/stp@types";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { VttInputMessage } from "../Types/Core/VttInputMessage";
import { VttOutputMessage } from "../Types/Core/VttOutputMessage";
import { VttOutputMessageType } from "../Types/Static/VttOutputMessageType";

type VttMessageHandler = (message: VttOutputMessage) => void;

export interface VttState {
	vttId: Guid | null;
	activeSceneId: Guid | null;
	campaign: Campaign;
	send: (message: VttInputMessage) => void;
	subscribe: (
		type: VttOutputMessageType,
		handler: VttMessageHandler,
	) => () => void;
	ignoreMessage: (id: Guid) => void;
	localDispatch: (message: VttOutputMessage) => void;
}

export type VttBasicContext = VttState;
const VttStoreContext = createContext<StoreApi<VttState> | null>(null);

interface VttContextProviderProps {
	campaign: Campaign;
	children: ReactNode;
}

function createVttStore(
	campaign: Campaign,
	socketRef: React.RefObject<WebSocket | null>,
): StoreApi<VttState> {
	const subscriptions = new Map<string, Set<VttMessageHandler>>();
	const ignoredMessages = new Set<Guid>();

	return createStore<VttState>()((set) => {
		function dispatchMessage(message: VttOutputMessage) {
			if (ignoredMessages.delete(message.id)) return;
			if (message.type === "VttCompleteSceneSnapshot")
				set({
					activeSceneId: (message.data as { sceneId: Guid }).sceneId,
				});
			const handlers = subscriptions.get(message.type);
			if (!handlers) return;
			handlers.forEach((handler) => {
				handler(message);
			});
		}

		return {
			vttId: null,
			activeSceneId: null,
			campaign,
			send: (message) => {
				try {
					const socket = socketRef.current;
					if (socket?.readyState !== WebSocket.OPEN) return;
					socket.send(JSON.stringify(message));
				} catch (ex) {
					console.error(ex);
				}
			},

			subscribe: (type, handler) => {
				let handlers = subscriptions.get(type);
				if (!handlers) {
					handlers = new Set<VttMessageHandler>();
					subscriptions.set(type, handlers);
				}
				handlers.add(handler);
				return () => {
					handlers.delete(handler);
					if (handlers.size === 0) subscriptions.delete(type);
				};
			},

			ignoreMessage: (id) => {
				ignoredMessages.add(id);
			},

			localDispatch: dispatchMessage,
		};
	});
}

export function VttContextProvider({
	campaign,
	children,
}: VttContextProviderProps) {
	const { vttId, socket } = useVttWebSocket();
	const socketRef = useRef<WebSocket | null>(socket);
	socketRef.current = socket;
	const [store] = useState(() => createVttStore(campaign, socketRef));

	useEffect(() => {
		store.setState({ vttId, campaign });
	}, [store, vttId, campaign]);

	useEffect(() => {
		if (!socket) return;
		function handleMessage(event: MessageEvent) {
			try {
				let message: VttOutputMessage;
				try {
					message = JSON.parse(event.data);
				} catch {
					console.error("Failed to parse VTT WebSocket message.", event.data);
					return;
				}
				store.getState().localDispatch(message);
			} catch (ex) {
				console.error(`Exception on HandleMessage: ${ex}`);
			}
		}

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		};
	}, [socket, store]);

	return (
		<VttStoreContext.Provider value={store}>
			{children}
		</VttStoreContext.Provider>
	);
}

export function useVttStoreApi(): StoreApi<VttState> {
	const store = useContext(VttStoreContext);
	if (!store)
		throw new Error("useVttStoreApi must be used inside a VttContextProvider.");
	return store;
}

export function useVttStore<T>(selector: (state: VttState) => T): T {
	return useStore(useVttStoreApi(), selector);
}

/**
 * Compatibility hook. Prefer passing a selector for granular subscriptions.
 */
export function useVttContext(): VttBasicContext;

export function useVttContext<T>(selector: (state: VttState) => T): T;

export function useVttContext<T>(
	selector?: (state: VttState) => T,
): T | VttBasicContext {
	const store = useVttStoreApi();
	const resolvedSelector: (state: VttState) => T | VttBasicContext =
		selector ?? ((state) => state);
	return useStore(store, resolvedSelector);
}
