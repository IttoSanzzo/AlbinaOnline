"use client";

import { useEffect } from "react";
import { useVttContext } from "../Contexts/VttContextProvider";
import { useVttTokenStore } from "./VttTokenStore";
import { RawVttToken, VttToken } from "../Types/Classes/VttToken";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";

function processVttToken(raw: RawVttToken): VttToken {
	return {
		...raw,
		placements: new Map(
			raw.placements.map((placement) => [placement.sceneId, placement]),
		),
	};
}

export function VttTokenStoreSync() {
	const subscribe = useVttContext((state) => state.subscribe);

	const replaceAll = useVttTokenStore((state) => state.replaceAll);
	const add = useVttTokenStore((state) => state.add);
	const update = useVttTokenStore((state) => state.update);
	const remove = useVttTokenStore((state) => state.remove);
	const startDrag = useVttTokenStore((state) => state.startDrag);
	const updateDrag = useVttTokenStore((state) => state.updateDrag);
	const endDrag = useVttTokenStore((state) => state.endDrag);
	const cancelDrag = useVttTokenStore((state) => state.cancelDrag);

	useEffect(() => {
		const unsubscribers = [
			subscribe("VttCompleteSceneSnapshot", (event) => {
				const payload = event.data as { tokens: RawVttToken[] };
				replaceAll(payload.tokens.map(processVttToken));
			}),
			subscribe("VttTokenAdded", (event) => {
				const vttToken = (event.data as { vttToken: RawVttToken }).vttToken;
				add(processVttToken(vttToken));
			}),
			subscribe("VttTokenUpdated", (event) => {
				const vttToken = (event.data as { vttToken: RawVttToken }).vttToken;
				update(processVttToken(vttToken));
			}),
			subscribe("VttTokenRemoved", (event) => {
				const payload = event.data as { vttTokenId: Guid };
				remove(payload.vttTokenId);
			}),
			subscribe("VttTokenDragStarted", (event) => {
				const payload = event.data as {
					vttTokenId: Guid;
					resourceLock: VttResourceLockDto;
				};
				startDrag(payload.vttTokenId, payload.resourceLock);
			}),
			subscribe("VttTokenDragUpdate", (event) => {
				const payload = event.data as {
					vttTokenId: Guid;
					coordinates: CoordinatePair;
				};
				updateDrag(payload.vttTokenId, payload.coordinates);
			}),
			subscribe("VttTokenDragEnded", (event) => {
				const payload = event.data as {
					vttTokenId: Guid;
					coordinates: CoordinatePair;
				};
				endDrag(payload.vttTokenId, payload.coordinates);
			}),
			subscribe("VttTokenDragCanceled", (event) => {
				const payload = event.data as {
					vttTokenId: Guid;
					coordinates: CoordinatePair;
				};
				cancelDrag(payload.vttTokenId, payload.coordinates);
			}),
		];

		return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
	}, [
		subscribe,
		replaceAll,
		add,
		update,
		remove,
		startDrag,
		updateDrag,
		endDrag,
		cancelDrag,
	]);

	return null;
}
