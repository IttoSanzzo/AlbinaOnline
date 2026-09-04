import styles from "./ClientCursor.module.css";
import { Guid } from "@/libs/stp@types";
import { VttMouseState } from "../../Types/VttMouseState";
import { newStyledElement } from "@setsu-tp/styled-components";
import { CursorSvg } from "./CursorSvg";
import { useVttMembersContext } from "../../Contexts/VttMembersProvider";

const ClientCursorContainer = newStyledElement.div(
	styles.clientCursorContainer,
);
const CursorUserName = newStyledElement.div(styles.cursorUserName);

interface ClientCursorProps {
	userId: Guid;
	mouseState: VttMouseState;
}
export function ClientCursor({ userId, mouseState }: ClientCursorProps) {
	const { members } = useVttMembersContext();

	const x = mouseState.x;
	const y = mouseState.y;
	return (
		<ClientCursorContainer
			style={{
				left: x,
				top: y,
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
				{members.find((member) => member.userId == userId)?.user.nickname}
			</CursorUserName>
		</ClientCursorContainer>
	);
}
