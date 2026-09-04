import styles from "./index.module.css";
import { Guid } from "@/libs/stp@types";
import { useVttContext } from "../../Contexts/VttContextProvider";
import { useEffect, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttMouseState } from "../../Types/VttMouseState";
import { useCurrentUser } from "@/libs/stp@hooks";
import { ClientCursor } from "./ClientCursor";

const ClientCursorsRenderer = newStyledElement.div(
	styles.clientCursorsRenderer,
);

export function CursorSyncronizer() {
	const { vttId, subscribe, send } = useVttContext();
	const { loading, user } = useCurrentUser();
	const [cursorsState, setCursorsState] = useState<Map<Guid, VttMouseState>>(
		new Map<Guid, VttMouseState>(),
	);
	if (!vttId) return null;

	const handleMouseMove = (event: MouseEvent) => {
		send({
			id: Guid.NewGuid(),
			type: "PostMouseState",
			data: {
				type: "Default",
				color1: "#00FF00",
				color2: "#000000",
				x: event.clientX,
				y: event.clientY,
			},
		});
	};

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
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [vttId, send]);

	if (!vttId || loading || !user) return null;
	return (
		<ClientCursorsRenderer>
			<br />
			<br />
			{Array.from(cursorsState.entries())
				// .filter(([userId, _]) => userId != user.id)
				.map(([userId, mouseState]) => (
					<ClientCursor
						key={userId}
						userId={userId}
						mouseState={mouseState}
					/>
				))}
		</ClientCursorsRenderer>
	);
}
