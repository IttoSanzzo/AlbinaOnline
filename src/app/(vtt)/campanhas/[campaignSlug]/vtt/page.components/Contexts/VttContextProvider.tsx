"use client";

import { useVttWebSocket } from "@/libs/stp@hooks/hooks/useVttWebSocket";
import { createContext, ReactNode, useContext, useEffect, useRef } from "react";

import { VttInputMessage } from "../Types/VttInputMessage";
import { VttOutputMessage } from "../Types/VttOutputtMessage";
import { Campaign, Guid } from "@/libs/stp@types";

type VttMessageHandler = (message: VttOutputMessage) => void;

interface VttBasicContext {
	vttId: Guid | null;
	campaign: Campaign;
	send: (message: VttInputMessage) => void;
	subscribe: (type: string, handler: VttMessageHandler) => () => void;
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
	const subscriptions = useRef<Map<string, Set<VttMessageHandler>>>(new Map());

	useEffect(() => {
		if (!socket) return;
		const handleMessage = (event: MessageEvent) => {
			let message: VttOutputMessage;
			try {
				message = JSON.parse(event.data);
			} catch {
				console.error("Failed to parse VTT WebSocket message.", event.data);
				return;
			}
			const handlers = subscriptions.current.get(message.type);
			if (!handlers) return;
			handlers.forEach((handler) => {
				handler(message);
			});
		};

		socket.addEventListener("message", handleMessage);

		return () => {
			socket.removeEventListener("message", handleMessage);
		};
	}, [socket]);

	const send = (message: VttInputMessage) => {
		if (socket?.readyState !== WebSocket.OPEN) return;
		socket.send(JSON.stringify(message));
	};

	const subscribe = (type: string, handler: VttMessageHandler) => {
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

	const contextValue: VttBasicContext = {
		vttId,
		campaign,
		send,
		subscribe,
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
