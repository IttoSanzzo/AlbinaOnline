"use client";

import styles from "./DDDiceServerShell.module.css";
import { ThreeDDice } from "dddice-js";
import { useEffect, useRef } from "react";
import { useVttContext } from "../../Contexts/VttContextProvider";
import { useAuthStore } from "@/libs/stp@hooks";

export function DDDiceIntegration() {
	const { vttId } = useVttContext();
	const { externalConnections } = useAuthStore();

	const dddiceRef = useRef<ThreeDDice | null>(null);
	useEffect(() => {
		if (dddiceRef.current != null || externalConnections == null) return;
		const userDDiceId = externalConnections.dddice;
		if (!userDDiceId || !userDDiceId.externalUserId) return;
		dddiceRef.current = new ThreeDDice(
			document.getElementById("dddice-canvas") as HTMLCanvasElement,
			userDDiceId.externalUserId,
			{
				dice: { size: 0.7 },
			},
		);
		dddiceRef.current.controlsEnabled = false;
		dddiceRef.current.start();
		// dddiceRef.current.connect("ROOM", "ROOMKEY");
	}, [vttId, externalConnections]);

	useEffect(() => {
		let timeoutRef: null | NodeJS.Timeout = null;
		function resizeCanva() {
			if (timeoutRef != null) clearTimeout(timeoutRef);
			timeoutRef = setTimeout(() => {
				if (!dddiceRef.current) return;
				dddiceRef.current.resize(window.innerWidth, window.window.innerHeight);
			}, 20);
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
