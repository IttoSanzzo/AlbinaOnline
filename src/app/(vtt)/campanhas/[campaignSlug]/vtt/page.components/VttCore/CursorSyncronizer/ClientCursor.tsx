import styles from "./ClientCursor.module.css";
import { Guid } from "@/libs/stp@types";
import { VttMouseState } from "../../Types/VttMouseState";
import { newStyledElement } from "@setsu-tp/styled-components";
import { CursorSvg } from "./CursorSvg";
import { useVttMembersContext } from "../../Contexts/VttMembersProvider";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import { useMemo } from "react";
import { OffScreenCursor } from "./OffScreenCursor";

const ClientCursorContainer = newStyledElement.div(
	styles.clientCursorContainer,
);
const CursorUserName = newStyledElement.div(styles.cursorUserName);

interface ClientCursorProps {
	userId: Guid;
	mouseState: VttMouseState;
	screenPosition: {
		x: number;
		y: number;
	};
}
export function ClientCursor({
	userId,
	mouseState,
	screenPosition,
}: ClientCursorProps) {
	const { members } = useVttMembersContext();
	const { isVisible, viewport, camera, setCameraPosition } =
		useVttViewportContext();
	const isInScreen = isVisible(
		{
			x: mouseState.x,
			y: mouseState.y,
		},
		"center",
		40,
	);
	const member = useMemo(
		() => members.find((member) => member.userId == userId),
		[userId, members],
	);

	if (isInScreen)
		return (
			<ClientCursorContainer
				style={{
					left: screenPosition.x,
					top: screenPosition.y,
				}}>
				<CursorSvg
					type={mouseState.type}
					mainColor={mouseState.color1}
					secondaryColor={mouseState.color2}
				/>
				<CursorUserName
					style={{
						color: mouseState.color1,
					}}>
					{member?.user.nickname ?? ""}
				</CursorUserName>
			</ClientCursorContainer>
		);
	const center = {
		x: viewport.width / 2,
		y: viewport.height / 2,
	};
	const angle = Math.atan2(
		screenPosition.y - center.y,
		screenPosition.x - center.x,
	);
	const distance = Math.sqrt(
		Math.pow(mouseState.x - camera.x, 2) + Math.pow(mouseState.y - camera.y, 2),
	);

	return (
		<OffScreenCursor
			member={member}
			mouseState={mouseState}
			screenPosition={screenPosition}
			angle={angle}
			distance={distance}
			onClick={() => {
				setCameraPosition(mouseState.x, mouseState.y);
			}}
		/>
	);
}
