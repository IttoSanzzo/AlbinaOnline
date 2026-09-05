import styles from "./index.module.css";
import { Guid } from "@/libs/stp@types";
import { useVttContext } from "../../Contexts/VttContextProvider";
import { useEffect, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttMouseState } from "../../Types/VttMouseState";
import { useCurrentUser } from "@/libs/stp@hooks";
import { ClientCursor } from "./ClientCursor";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";

const ClientCursorsRenderer = newStyledElement.div(
	styles.clientCursorsRenderer,
);

export function CursorSyncronizer() {
	const { vttId, subscribe, send } = useVttContext();
	const { loading, user } = useCurrentUser();
	const { screenToWorld, worldToScreen } = useVttViewportContext();
	const [cursorsState, setCursorsState] = useState<Map<Guid, VttMouseState>>(
		new Map<Guid, VttMouseState>(),
	);
	if (!vttId) return null;

	useEffect(() => {
		if (!vttId) return;
		subscribe("MouseStates", (message) => {
			const states = message.data as Record<Guid, VttMouseState>;
			setCursorsState(
				new Map(Object.entries(states) as [Guid, VttMouseState][]),
			);
		});
	}, [vttId, subscribe, setCursorsState]);

	useEffect(() => {
		if (!vttId) return;
		function handleMouseMove(event: MouseEvent) {
			const worldPosition = screenToWorld({
				x: event.clientX,
				y: event.clientY,
			});
			send({
				id: Guid.NewGuid(),
				type: "PostMouseState",
				data: {
					type: "Default",
					color1: "#00FF00",
					color2: "#000000",
					x: Math.round(worldPosition.x),
					y: Math.round(worldPosition.y),
				},
			});
		}
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [vttId, send, screenToWorld]);

	if (!vttId || loading || !user) return null;
	return (
		<ClientCursorsRenderer>
			{Array.from(cursorsState.entries())
				.filter(([userId]) => userId != user.id)
				.map(([userId, mouseState]) => {
					const screenPosition = worldToScreen({
						x: mouseState.x,
						y: mouseState.y,
					});
					return (
						<ClientCursor
							key={userId}
							userId={userId}
							mouseState={mouseState}
							screenPosition={{
								x: screenPosition.x,
								y: screenPosition.y,
							}}
						/>
					);
				})}
		</ClientCursorsRenderer>
	);
}
