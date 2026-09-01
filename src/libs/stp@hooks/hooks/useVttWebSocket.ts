"use client";

import { useEffect } from "react";
import { useVttWebSocketStore } from "../stores/useVttWebSocketStore";
import { Guid } from "@/libs/stp@types";

export function useVttWebSocket(campaignId?: Guid) {
	const {
		socket,
		vttId,
		connected,
		connecting,
		connect,
		disconnect,
		clear,
		closeMessage,
	} = useVttWebSocketStore();

	useEffect(() => {
		if (!campaignId) return;
		connect(campaignId).catch((error) => {
			console.error("Could not connect VTT WebSocket:", error);
		});

		return () => {
			if (useVttWebSocketStore.getState().vttId !== campaignId) return;
			useVttWebSocketStore.getState().disconnect();
		};
	}, [campaignId, connect, disconnect]);

	return {
		socket,
		vttId,
		connected,
		connecting,
		connect,
		disconnect,
		clear,
		closeMessage,
	};
}
