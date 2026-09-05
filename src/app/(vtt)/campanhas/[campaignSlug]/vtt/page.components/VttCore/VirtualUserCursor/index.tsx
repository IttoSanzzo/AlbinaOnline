"use client";

import { useCurrentUser } from "@/libs/stp@hooks";
import { useVttInteractionContext } from "../../Contexts/VttInteractionContextProvider";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import { ClientCursor } from "../CursorSyncronizer/ClientCursor";
import { useEffect, useState } from "react";
import { VttMouseState } from "../../Types/VttMouseState";

export function VirtualUserCursor() {
	const { user, loading } = useCurrentUser();
	const { interaction } = useVttInteractionContext();
	const { screenToWorld } = useVttViewportContext();

	const [mouseState, setMouseState] = useState<VttMouseState>({
		type: interaction.type,
		color1: "#00FF00",
		color2: "#000000",
		x: 0,
		y: 0,
	});

	const [screenPosition, setScreenPosition] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		function handleMouseMove(event: MouseEvent) {
			const screenPosition = {
				x: event.clientX,
				y: event.clientY,
			};

			const worldPosition = screenToWorld(screenPosition);

			setScreenPosition(screenPosition);

			setMouseState({
				type: interaction.type,
				color1: "#00FF00",
				color2: "#000000",
				x: Math.round(worldPosition.x),
				y: Math.round(worldPosition.y),
			});
		}

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [screenToWorld, interaction.type]);

	useEffect(() => {
		setMouseState((current) => ({
			...current,
			type: interaction.type,
		}));
	}, [interaction.type]);

	if (loading || !user) return null;

	return (
		<ClientCursor
			mouseState={mouseState}
			screenPosition={screenPosition}
			userId={user.id}
			isActiveUser
		/>
	);
}
