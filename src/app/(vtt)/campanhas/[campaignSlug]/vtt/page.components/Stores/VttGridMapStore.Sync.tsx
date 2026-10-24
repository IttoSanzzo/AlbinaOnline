"use client";

import { useEffect } from "react";
import { useVttContext } from "../Contexts/VttContextProvider";
import { useVttGridMapStore } from "./VttGridMapStore";
import { VttGridMap } from "../Types/Classes/VttGridMap";
import { VttResourceLockDto } from "../Types/Classes/VttResourceLock";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";

export function VttGridMapStoreSync() {
	const subscribe = useVttContext((state) => state.subscribe);

	const replaceAll = useVttGridMapStore((state) => state.replaceAll);
	const add = useVttGridMapStore((state) => state.add);
	const update = useVttGridMapStore((state) => state.update);
	const remove = useVttGridMapStore((state) => state.remove);
	const startDrag = useVttGridMapStore((state) => state.startDrag);
	const updateDrag = useVttGridMapStore((state) => state.updateDrag);
	const endDrag = useVttGridMapStore((state) => state.endDrag);
	const cancelDrag = useVttGridMapStore((state) => state.cancelDrag);

	useEffect(() => {
		const unsubscribers = [
			subscribe("VttCompleteSceneSnapshot", (event) => {
				const payload = event.data as { gridMaps: VttGridMap[] };
				replaceAll(payload.gridMaps);
			}),
			subscribe("VttGridMapAdded", (event) => {
				const payload = event.data as { vttGridMap: VttGridMap };
				add(payload.vttGridMap);
			}),
			subscribe("VttGridMapUpdated", (event) => {
				const payload = event.data as { vttGridMap: VttGridMap };
				update(payload.vttGridMap);
			}),
			subscribe("VttGridMapRemoved", (event) => {
				const payload = event.data as { vttGridMapId: Guid };
				remove(payload.vttGridMapId);
			}),
			subscribe("VttGridMapDragStarted", (event) => {
				const payload = event.data as {
					vttGridMapId: Guid;
					resourceLock: VttResourceLockDto;
				};
				startDrag(payload.vttGridMapId, payload.resourceLock);
			}),
			subscribe("VttGridMapDragUpdate", (event) => {
				const payload = event.data as {
					vttGridMapId: Guid;
					coordinates: CoordinatePair;
				};
				updateDrag(payload.vttGridMapId, payload.coordinates);
			}),
			subscribe("VttGridMapDragEnded", (event) => {
				const payload = event.data as {
					vttGridMapId: Guid;
					coordinates: CoordinatePair;
				};
				endDrag(payload.vttGridMapId, payload.coordinates);
			}),
			subscribe("VttGridMapDragCanceled", (event) => {
				const payload = event.data as {
					vttGridMapId: Guid;
					coordinates: CoordinatePair;
				};
				cancelDrag(payload.vttGridMapId, payload.coordinates);
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
