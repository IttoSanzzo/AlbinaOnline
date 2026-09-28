import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useEffect, useRef, useState } from "react";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import { useVttAudioController } from "../../../Contexts/AudioManager/VttAudioControllerContext";
import { audioPaths } from "../../../Contexts/AudioManager/audioPaths";
import { ChatMessage } from "./ChatMessage";
import { ChatFileInput, SendDraggedImageToChatHandle } from "./ChatFileInput";
import { StpIcon } from "@/libs/stp@icons";
import { ChatTextInput } from "./ChatTextInput";
import { Guid, LintIgnoredAny } from "@/libs/stp@types";
import { useLocalStorageState } from "@/utils/Storage";

const CommunicationContainer = newStyledElement.div(
	styles.communicationContainer,
);

export function Communication() {
	return (
		<CommunicationContainer>
			<Chat />
		</CommunicationContainer>
	);
}

// Form ////////////////////////////////////////////////////////////////////////
const ChatContainer = newStyledElement.div(styles.chatContainer);
const ChatHistoryResizeContainer = newStyledElement.div(
	styles.chatHistoryResizeContainer,
);
const ChatHistoryContainer = newStyledElement.div(styles.chatHistoryContainer);
const ChatHistoryResizeHandle = newStyledElement.div(
	styles.chatHistoryResizeHandle,
);
const GoToBottomButton = newStyledElement.button(styles.goToBottomButton);

export const CHAT_SUBMIT_COOLDOWN_MS = 500;
const CHAT_HISTORY_MIN_HEIGHT = 80;
const CHAT_HISTORY_MAX_HEIGHT = 500;
const CHAT_SCROLL_THRESHOLD = 10;

function isAtBottom(element: HTMLDivElement): boolean {
	return (
		element.scrollHeight - element.scrollTop - element.clientHeight <=
		CHAT_SCROLL_THRESHOLD
	);
}

function Chat() {
	const { subscribe, send } = useVttContext();

	const { play } = useVttAudioController();
	const { members } = useVttMembersContext();

	const [chatMessages, setChatMessages] = useState<VttChatMessage[]>([]);
	const [chatHistoryHeight, setChatHistoryHeight] = useLocalStorageState(
		"vtt-chat-history-size",
		150,
	);
	const [hasNewMessages, setHasNewMessages] = useState(false);
	const [hasScrollTop, setHasScrollTop] = useState(false);
	const [hasScrollBottom, setHasScrollBottom] = useState(false);
	const messageToReplyIdState = useState<Guid | undefined>(undefined);

	const historyRef = useRef<HTMLDivElement>(null);
	const shouldScrollToBottom = useRef(true);
	const isProgrammaticScroll = useRef(false);
	const isResizing = useRef(false);
	const resizeStartY = useRef(0);
	const resizeStartHeight = useRef(150);
	const isChatHovered = useRef(false);
	const isChatFocused = useRef(false);
	const lastSubmitAttempt = useRef(0);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const sendImageModalRef = useRef<SendDraggedImageToChatHandle | null>(null);

	function updateScrollState() {
		const history = historyRef.current;
		if (!history) return;
		const atTop = history.scrollTop <= CHAT_SCROLL_THRESHOLD;
		const atBottom = isAtBottom(history);
		setHasScrollTop(!atTop);
		setHasScrollBottom(!atBottom);
		if (atBottom) setHasNewMessages(false);
	}
	function handleHistoryScroll() {
		if (isProgrammaticScroll.current) return;
		updateScrollState();
	}
	function scrollToLatestMessages() {
		const history = historyRef.current;
		if (!history) return;

		isProgrammaticScroll.current = true;
		shouldScrollToBottom.current = true;
		setHasNewMessages(false);
		history.scrollTo({
			top: history.scrollHeight,
			behavior: "smooth",
		});
		const checkScroll = () => {
			const currentHistory = historyRef.current;
			if (!currentHistory) {
				isProgrammaticScroll.current = false;
				return;
			}
			if (isAtBottom(currentHistory)) {
				isProgrammaticScroll.current = false;
				updateScrollState();
				return;
			}
			requestAnimationFrame(checkScroll);
		};
		requestAnimationFrame(checkScroll);
	}
	function handleResizeStart(event: React.PointerEvent) {
		isResizing.current = true;
		resizeStartY.current = event.clientY;
		resizeStartHeight.current = chatHistoryHeight;
		event.currentTarget.setPointerCapture(event.pointerId);
	}
	function handleResizeMove(event: React.PointerEvent) {
		if (!isResizing.current) return;
		const delta = resizeStartY.current - event.clientY;
		const height = Math.min(
			Math.max(resizeStartHeight.current + delta, CHAT_HISTORY_MIN_HEIGHT),
			CHAT_HISTORY_MAX_HEIGHT,
		);
		setChatHistoryHeight(height);
	}
	function handleResizeEnd() {
		isResizing.current = false;
	}

	useEffect(() => {
		const unsubscribe1 = subscribe("VttAllChatMessages", (event) => {
			setChatMessages(event.data as VttChatMessage[]);
		});
		const unsubscribe2 = subscribe("VttChatMessage", (event) => {
			const wasAtBottom = shouldScrollToBottom.current;
			const chatIsActive = isChatHovered.current || isChatFocused.current;
			if (!chatIsActive || !wasAtBottom) {
				play({
					path: audioPaths.vtt.chat.NewMessage,
					type: "vtt.chat",
					sourceId: event.userId,
					volume: 0.75,
				});
			}
			setChatMessages((state) => [...state, event.data as VttChatMessage]);
			if (!wasAtBottom) setHasNewMessages(true);
		});
		const unsubscribe3 = subscribe("VttDeleteChatMessage", (event) => {
			const idToRemove = (event.data as LintIgnoredAny).messageId;
			setChatMessages((state) =>
				state.filter((message) => message.id != idToRemove),
			);
		});
		send({
			id: Guid.NewGuid(),
			type: "RequestChatMessages",
			data: {},
		});
		return () => {
			unsubscribe1();
			unsubscribe2();
			unsubscribe3();
		};
	}, [setChatMessages, subscribe, send]);
	useEffect(() => {
		const history = historyRef.current;
		if (!history) return;
		const messageElements = Array.from(history.children).filter(
			(element) =>
				element instanceof HTMLElement && element.tagName !== "BUTTON",
		) as HTMLElement[];
		if (messageElements.length === 0) {
			shouldScrollToBottom.current = true;
			return;
		}
		const recentMessages = messageElements.slice(-3);
		const visibleMessages = new Set<Element>();
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) visibleMessages.add(entry.target);
					else visibleMessages.delete(entry.target);
				});
				const isRecentMessageVisible = visibleMessages.size > 0;
				shouldScrollToBottom.current = isRecentMessageVisible;
				if (isRecentMessageVisible) setHasNewMessages(false);
				else setHasNewMessages(true);
			},
			{
				root: history,
				threshold: 0,
			},
		);
		recentMessages.forEach((message) => observer.observe(message));
		return () => observer.disconnect();
	}, [chatMessages]);
	useEffect(() => {
		const history = historyRef.current;
		if (!history) return;
		const messageElements = Array.from(history.children).filter(
			(element) =>
				element instanceof HTMLElement && element.tagName !== "BUTTON",
		) as HTMLElement[];
		if (messageElements.length === 0) return;
		const resizeObserver = new ResizeObserver(() => {
			if (!shouldScrollToBottom.current) return;
			isProgrammaticScroll.current = true;
			history.scrollTop = history.scrollHeight;
			isProgrammaticScroll.current = false;
			updateScrollState();
		});
		messageElements.forEach((element) => resizeObserver.observe(element));
		return () => resizeObserver.disconnect();
	}, [chatMessages]);
	useEffect(() => {
		const history = historyRef.current;
		if (!history) return;
		if (shouldScrollToBottom.current) {
			isProgrammaticScroll.current = true;
			history.scrollTo({
				top: history.scrollHeight,
				behavior: "auto",
			});
			isProgrammaticScroll.current = false;
		}
		updateScrollState();
	}, [chatMessages, chatHistoryHeight]);

	const messageToReply = messageToReplyIdState[0]
		? chatMessages.find(
				(messageToReply) => messageToReply.id == messageToReplyIdState[0],
			)
		: undefined;
	const messageToReplyMember = messageToReply
		? members.find((member) => member.userId == messageToReply.userId)
		: undefined;

	return (
		<ChatContainer
			onMouseEnter={() => {
				isChatHovered.current = true;
			}}
			onMouseLeave={() => {
				isChatHovered.current = false;
			}}
			onFocusCapture={() => {
				isChatFocused.current = true;
			}}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node))
					isChatFocused.current = false;
			}}
			onDragEnter={(e) => {
				e.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				const toElement = e.relatedTarget as Node | null;
				if (toElement && e.currentTarget.contains(toElement)) return;
				setIsDragging(false);
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={async (e) => {
				e.preventDefault();
				setIsDragging(false);
				if (sendImageModalRef.current)
					sendImageModalRef.current.openByDragEvent(e);
			}}>
			<ChatHistoryResizeContainer>
				<ChatHistoryResizeHandle
					onPointerDown={handleResizeStart}
					onPointerMove={handleResizeMove}
					onPointerUp={handleResizeEnd}
					onPointerCancel={handleResizeEnd}
					{...setVttElementHoverInteraction(
						VttCursorInteractionType.ResizeVertical,
					)}
				/>
				<ChatHistoryContainer
					ref={historyRef}
					onScroll={handleHistoryScroll}
					tabIndex={-1}
					data-scroll-top={hasScrollTop}
					data-scroll-bottom={hasScrollBottom}
					style={{
						height: `${chatHistoryHeight}px`,
					}}>
					{chatMessages.map((message) => {
						const messageToReply = message.messageToReplyId
							? chatMessages.find(
									(messageToReply) =>
										messageToReply.id == message.messageToReplyId,
								)
							: undefined;
						return (
							<ChatMessage
								key={message.id}
								message={message}
								member={members.find(
									(member) => member.userId == message.userId,
								)}
								messageToReply={messageToReply}
								messageToReplyMember={
									messageToReply
										? members.find(
												(member) => member.userId == messageToReply.userId,
											)
										: undefined
								}
								messageToReplyIdState={messageToReplyIdState}
								members={members}
							/>
						);
					})}
					{hasNewMessages && (
						<GoToBottomButton
							{...setVttElementHoverInteraction(
								VttCursorInteractionType.Pointer,
							)}
							type="button"
							onClick={scrollToLatestMessages}>
							<StpIcon name={"ArrowFatLineDown"} />
						</GoToBottomButton>
					)}
				</ChatHistoryContainer>
			</ChatHistoryResizeContainer>
			<ChatTextInput
				lastSubmitAttempt={lastSubmitAttempt}
				send={send}
				setHasNewMessages={setHasNewMessages}
				shouldScrollToBottom={shouldScrollToBottom}
				messageToReplyIdState={messageToReplyIdState}
				messageToReply={messageToReply}
				messageToReplyMember={messageToReplyMember}
				members={members}
				allChatMessages={chatMessages}
			/>
			<ChatFileInput
				ref={sendImageModalRef}
				lastSubmitAttempt={lastSubmitAttempt}
				send={send}
				isDragging={isDragging}
				messageToReplyIdState={messageToReplyIdState}
				messageToReply={messageToReply}
			/>
		</ChatContainer>
	);
}
