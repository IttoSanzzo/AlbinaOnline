"use client";

import styles from "./index.module.css";
import { ThreeDDice } from "dddice-js";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/libs/stp@hooks";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useVttContext } from "../../Contexts/VttContextProvider";

export function DDDiceIntegration() {
	const { campaign } = useVttContext();
	const { externalConnections } = useAuthStore();
	const [roomData, setRoomData] = useState<null | {
		roomSlug: string;
		roomPassword?: string;
	}>(null);

	useEffect(() => {
		if (
			!externalConnections ||
			!externalConnections.dddice ||
			!externalConnections.dddice.externalUserId
		)
			return;
		(async () => {
			const response = await authenticatedFetchAsync(
				`/campaigns/${campaign.slug}/integrations/dddice`,
			);
			if (!response.ok) return;
			setRoomData(await response.json());
		})();
	}, [externalConnections]);

	if (
		!roomData ||
		!externalConnections ||
		!externalConnections.dddice ||
		!externalConnections.dddice.externalUserId
	)
		return null;
	return (
		<DDDiceCanvas
			userDDDiceId={externalConnections.dddice.externalUserId}
			roomSlug={roomData.roomSlug}
			roomPassword={roomData.roomPassword}
		/>
	);
}

interface DDDiceCanvasProps {
	userDDDiceId: string;
	roomSlug: string;
	roomPassword?: string;
}
function DDDiceCanvas({
	userDDDiceId,
	roomSlug,
	roomPassword,
}: DDDiceCanvasProps) {
	const dddiceRef = useRef<ThreeDDice | null>(null);

	useEffect(() => {
		if (dddiceRef.current) return;
		dddiceRef.current = new ThreeDDice(
			document.getElementById("dddice-canvas") as HTMLCanvasElement,
			userDDDiceId,
			{
				dice: { size: 0.7 },
			},
		);
		dddiceRef.current.controlsEnabled = false;
		dddiceRef.current.start();
		dddiceRef.current.connect(roomSlug, roomPassword);

		return () => {
			if (!dddiceRef.current) return;
			dddiceRef.current.stop();
			dddiceRef.current = null;
		};
	}, [userDDDiceId, roomSlug, roomPassword]);

	useEffect(() => {
		let timeoutRef: null | NodeJS.Timeout = null;
		function resizeCanva() {
			if (timeoutRef != null) clearTimeout(timeoutRef);
			timeoutRef = setTimeout(() => {
				if (!dddiceRef.current) return;
				dddiceRef.current.stop();
				dddiceRef.current.resize(window.innerWidth, window.window.innerHeight);
				dddiceRef.current.start();
			}, 250);
		}
		resizeCanva();
		const observer = new ResizeObserver(resizeCanva);
		observer.observe(document.body);
		return () => observer.disconnect();
	}, []);

	return (
		<canvas
			className={styles.dDDiceCanvas}
			id={"dddice-canvas"}
		/>
	);
}
