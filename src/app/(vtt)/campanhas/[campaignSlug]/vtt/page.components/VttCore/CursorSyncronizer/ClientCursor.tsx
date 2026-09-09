import styles from "./ClientCursor.module.css";
import { Guid } from "@/libs/stp@types";
import { VttInteractionType, VttMouseState } from "../../Types/VttMouseState";
import { newStyledElement } from "@setsu-tp/styled-components";
import { CursorSvg } from "./CursorSvg";
import { useVttMembersContext } from "../../Contexts/VttMembersProvider";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import { useMemo } from "react";
import { OffScreenCursor } from "./OffScreenCursor";
import { useVttInteractionContext } from "../../Contexts/VttInteractionContextProvider";

const ClientCursorContainer = newStyledElement.div(
	styles.clientCursorContainer,
);
const CursorUserName = newStyledElement.div(styles.cursorUserName);

const horizontalCursorOffset: Record<VttInteractionType, number> = {
	Default: 3,
	DefaultUp: 11,
	Pointer: 9,
	Brush: 1,
	Menu: 3,
	Chat: 3,
	Hand: 11,
	Move: 12,
	Eraser: 3,
	Measuring: 4,
};
const verticalCursorOffset: Record<VttInteractionType, number> = {
	Default: 3,
	DefaultUp: 2,
	Pointer: 2,
	Brush: 1,
	Menu: 3,
	Chat: 3,
	Hand: 11,
	Move: 12,
	Eraser: 3,
	Measuring: 4,
};

interface ClientCursorProps {
	userId: Guid;
	mouseState: VttMouseState;
	screenPosition: {
		x: number;
		y: number;
	};
	isActiveUser?: boolean;
}
export function ClientCursor({
	userId,
	mouseState,
	screenPosition,
	isActiveUser = false,
}: ClientCursorProps) {
	const { members } = useVttMembersContext();
	const { isVisible, viewport, camera, setCameraPosition } =
		useVttViewportContext();
	const { hoverInteractionType } = useVttInteractionContext();
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

	if (isInScreen || isActiveUser) {
		if (isActiveUser && hoverInteractionType)
			mouseState.type = hoverInteractionType;
		return (
			<ClientCursorContainer
				style={{
					transition: isActiveUser ? "none" : undefined,
					zIndex: isActiveUser ? 2147483647 : undefined,
					position: isActiveUser ? "fixed" : undefined,
					left: screenPosition.x - horizontalCursorOffset[mouseState.type],
					top: screenPosition.y - verticalCursorOffset[mouseState.type],
				}}>
				<CursorSvg
					type={mouseState.type}
					mainColor={mouseState.color1}
					secondaryColor={mouseState.color2}
				/>
				{!isActiveUser && (
					<CursorUserName
						style={{
							color: mouseState.color1,
						}}>
						{member?.user.nickname ?? ""}
					</CursorUserName>
				)}
			</ClientCursorContainer>
		);
	}
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
