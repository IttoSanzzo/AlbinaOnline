"use client";

import styles from "./ChatMessageContextMenu.module.css";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { Guid } from "@/libs/stp@types";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import clsx from "clsx";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";

const ChatMessageContextMenuContainer = newStyledElement.div(
	styles.chatMessageContextMenuContainer,
);

interface ChatMessageContextMenuProps {
	position: {
		x: number;
		y: number;
	};
	messageId: Guid;
	messageAuthorId: Guid;
	closeContextMenu: () => void;
	onReply: () => void;
}

export function ChatMessageContextMenu({
	position,
	closeContextMenu,
	messageAuthorId,
	messageId,
	onReply,
}: ChatMessageContextMenuProps) {
	const { member } = useCurrentCampaignMember();
	const { send } = useVttContext();
	const [mounted, setMounted] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		const handleMouseDown = (event: MouseEvent) => {
			if (
				menuRef.current &&
				event.target instanceof Node &&
				!menuRef.current.contains(event.target)
			)
				closeContextMenu();
		};
		document.addEventListener("mousedown", handleMouseDown);
		return () => document.removeEventListener("mousedown", handleMouseDown);
	}, [mounted, closeContextMenu]);

	if (!mounted) return null;

	return createPortal(
		<ChatMessageContextMenuContainer
			ref={menuRef}
			style={{
				position: "fixed",
				top: position.y,
				left: position.x,
				zIndex: 1000,
			}}>
			<button
				className={styles.menuButton}
				{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
				onClick={() => {
					onReply();
					closeContextMenu();
				}}>
				Responder
			</button>
			{member && (member.isMaster || member.userId == messageAuthorId) && (
				<button
					className={clsx(styles.menuButton, styles.deleteButton)}
					{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
					onClick={() => {
						send({
							id: Guid.NewGuid(),
							type: "DeleteChatMessage",
							data: { messageId: messageId },
						});
						closeContextMenu();
					}}>
					Excluir
				</button>
			)}
		</ChatMessageContextMenuContainer>,
		document.body,
	);
}
