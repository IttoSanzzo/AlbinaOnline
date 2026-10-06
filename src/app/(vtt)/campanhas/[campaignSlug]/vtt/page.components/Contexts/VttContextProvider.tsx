"use client";

import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { VttInputMessage } from "../Types/VttInputMessage";
import { VttOutputMessage } from "../Types/VttOutputMessage";
import { Campaign, Guid } from "@/libs/stp@types";
import { VttOutputMessageType } from "../Types/Static/VttOutputMessageType";

type VttMessageHandler = (message: VttOutputMessage) => void;

interface VttBasicContext {
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

const VttContext = createContext<VttBasicContext | null>(null);

interface VttContextProviderProps {
	campaign: Campaign;
	children: ReactNode;
}

export function VttContextProvider({
	campaign,
	children,
}: VttContextProviderProps) {
	const { vttId, socket } = useVttWebSocket();
	const [activeSceneId, setActiveSceneId] = useState<Guid | null>(null);
	const subscriptions = useRef<Map<string, Set<VttMessageHandler>>>(new Map());
	const ignoredMessages = useRef<Set<Guid>>(new Set());

	const dispatchMessage = (message: VttOutputMessage) => {
		if (ignoredMessages.current.delete(message.id)) return;
		if (message.type === "VttCompleteSceneSnapshot")
			setActiveSceneId((message.data as { sceneId: Guid }).sceneId);
		const handlers = subscriptions.current.get(message.type);
		if (!handlers) return;
		handlers.forEach((handler) => {
			handler(message);
		});
	};

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
				dispatchMessage(message);
			} catch (ex) {
				console.error(`Exception on HandleMessage: ${ex}`);
			}
		}

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		};
	}, [socket]);

	const send = (message: VttInputMessage) => {
		try {
			if (socket?.readyState !== WebSocket.OPEN) return;
			socket.send(JSON.stringify(message));
		} catch (ex) {
			console.error(ex);
		}
	};

	const subscribe = (
		type: VttOutputMessageType,
		handler: VttMessageHandler,
	) => {
		let handlers = subscriptions.current.get(type);
		if (!handlers) {
			handlers = new Set<VttMessageHandler>();
			subscriptions.current.set(type, handlers);
		}
		handlers.add(handler);
		return () => {
			handlers?.delete(handler);
			if (handlers?.size === 0) subscriptions.current.delete(type);
		};
	};

	function ignoreMessage(id: Guid) {
		ignoredMessages.current.add(id);
	}

	function localDispatch(message: VttOutputMessage) {
		dispatchMessage(message);
	}

	const contextValue: VttBasicContext = {
		vttId,
		activeSceneId,
		campaign,
		send,
		subscribe,
		ignoreMessage,
		localDispatch,
	};

	return (
		<VttContext.Provider value={contextValue}>{children}</VttContext.Provider>
	);
}

export function useVttContext(): VttBasicContext {
	const context = useContext(VttContext);
	if (!context)
		throw new Error("useVttContext must be used inside a VttContextProvider.");
	return context;
}
