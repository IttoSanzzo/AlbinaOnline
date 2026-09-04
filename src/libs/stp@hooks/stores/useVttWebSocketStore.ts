"use client";

import { create } from "zustand";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { Guid } from "@/libs/stp@types";

interface VttWebSocketState {
	socket: WebSocket | null;
	vttId: Guid | null;

	connected: boolean;
	connecting: boolean;
	closeMessage: string | null | undefined;

	connect: (vttId: Guid) => Promise<void>;
	disconnect: () => void;
	clear: () => void;
}

let connectPromise: Promise<void> | null = null;

export const useVttWebSocketStore = create<VttWebSocketState>((set, get) => ({
	socket: null,
	vttId: null,

	connected: false,
	connecting: false,
	closeMessage: undefined,

	connect: async (vttId: Guid) => {
		const current = get();

		if (current.vttId === vttId && (current.connected || current.connecting))
			return;

		if (connectPromise != null) return connectPromise;

		connectPromise = (async () => {
			const currentSocket = get().socket;

			if (currentSocket != null) currentSocket.close();

			set({
				socket: null,
				vttId,
				connected: false,
				connecting: true,
				closeMessage: null,
			});

			const refreshResponse = await fetch(
				getAlbinaApiFullAddress("/auth/refresh"),
				{
					method: "POST",
					credentials: "include",
				},
			);

			if (!refreshResponse.ok) {
				const error = "Could not refresh authentication.";

				set({
					socket: null,
					vttId,
					connected: false,
					connecting: false,
					closeMessage: error,
				});

				throw error;
			}

			const socketUrl = getAlbinaApiFullAddress(`/sockets/vtt/${vttId}`)
				.replace(/^http:/, "ws:")
				.replace(/^https:/, "wss:");

			const socket = new WebSocket(socketUrl);

			set({
				socket,
			});

			await new Promise<void>((resolve) => {
				socket.onopen = () => {
					set({
						socket,
						vttId,
						connected: true,
						connecting: false,
						closeMessage: null,
					});

					resolve();
				};

				socket.onerror = () => {
					const closeMessage = "VTT WebSocket connection failed.";

					set({
						socket: null,
						vttId,
						connected: false,
						connecting: false,
						closeMessage: closeMessage,
					});
				};

				socket.onclose = (event) => {
					if (get().socket !== socket) return;
					console.log(event.code);

					const closeMessage =
						event.reason ||
						`VTT WebSocket closed unexpectedly (${event.code}).`;

					set({
						socket: null,
						connected: false,
						connecting: false,
						closeMessage: closeMessage,
					});
				};

				// socket.onmessage = (event) => {
				// console.log("VTT WebSocket message:", event.data);
				// };
			});
		})();

		try {
			await connectPromise;
		} finally {
			connectPromise = null;
		}
	},

	disconnect: () => {
		const socket = get().socket;

		if (socket != null) socket.close();

		set({
			socket: null,
			connected: false,
			connecting: false,
		});
	},

	clear: () => {
		const socket = get().socket;

		if (socket != null) socket.close();

		set({
			socket: null,
			vttId: null,
			connected: false,
			connecting: false,
			closeMessage: null,
		});
	},
}));
