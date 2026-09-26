import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { HookedForm } from "@/libs/stp@forms";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Guid } from "@/libs/stp@types";
import { RefObject, useEffect, useRef, useState } from "react";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import { useVttAudioController } from "../../../Contexts/AudioManager/VttAudioControllerContext";
import { audioPaths } from "../../../Contexts/AudioManager/audioPaths";
import { ChatMessage } from "./ChatMessage";
import { ChatFileInput, SendDraggedImageToChatHandle } from "./ChatFileInput";
import { StpIcon } from "@/libs/stp@icons";
import { useVttInteractionContext } from "../../../Contexts/VttInteractionContextProvider";

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

const schema = z.object({
	message: z.string(),
});
type FormData = z.infer<typeof schema>;

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
function canOpenChat(event: KeyboardEvent): boolean {
	if (event.repeat) return false;
	if (event.ctrlKey || event.altKey || event.metaKey) return false;
	const target = event.target;
	if (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLSelectElement ||
		(target instanceof HTMLElement && target.isContentEditable)
	)
		return false;
	return true;
}

function Chat() {
	const { subscribe, send } = useVttContext();
	const { setInteraction, interaction } = useVttInteractionContext();
	const { play } = useVttAudioController();
	const { members } = useVttMembersContext();
	const [chatMessages, setChatMessages] = useState<VttChatMessage[]>([]);
	const [chatHistoryHeight, setChatHistoryHeight] = useState(150);
	const [hasNewMessages, setHasNewMessages] = useState(false);
	const [hasScrollTop, setHasScrollTop] = useState(false);
	const [hasScrollBottom, setHasScrollBottom] = useState(false);
	const chatInputRef = useRef<HTMLTextAreaElement>(null);
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
		return subscribe("VttChatMessage", (event) => {
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
	}, [subscribe]);
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
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Enter" || !canOpenChat(event) || !chatInputRef.current)
				return;
			event.preventDefault();
			chatInputRef.current.focus();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const form = useForm<FormData>({
		mode: "all",
		resolver: zodResolver(schema),
		defaultValues: {
			message: "",
		},
	});

	const watchedMessage = (form.watch().message ?? "").trim();

	async function handleSubmit(data: FormData) {
		const now = Date.now();
		if (now - lastSubmitAttempt.current < CHAT_SUBMIT_COOLDOWN_MS) return;
		lastSubmitAttempt.current = now;
		if (data.message.trim().length == 0) return;
		send({
			id: Guid.NewGuid(),
			type: "PostChatMessage",
			data: {
				text: data.message,
			},
		});
		form.reset();
	}

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
					{chatMessages.map((message) => (
						<ChatMessage
							key={`${message.timestamp}|${message.userId}`}
							message={message}
							member={members.find((member) => member.userId == message.userId)}
						/>
					))}
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
			<HookedForm.Form<FormData>
				form={form}
				onSubmit={handleSubmit}>
				<HookedForm.TextAreaInput<FormData>
					fieldName="message"
					label={""}
					placeholder={"Digite uma Mensagem"}
					height={"60px"}
					borderColor={"transparent"}
					style={
						watchedMessage.length == 0
							? {
									color: "var(--cl-gray-600)",
									textAlign: "center",
								}
							: {
									color: "var(--cl-gray-200)",
								}
					}
					className={styles.chatInput}
					inputRef={chatInputRef as RefObject<HTMLTextAreaElement>}
					{...setVttElementHoverInteraction(VttCursorInteractionType.Chat)}
					onFocus={() => {
						setInteraction({
							...interaction,
							type: VttCursorInteractionType.Chat,
						});
					}}
					onBlur={() => {
						setInteraction({
							...interaction,
							type: VttCursorInteractionType.Default,
						});
					}}
					onInput={(event) => {
						const textarea = event.currentTarget;
						textarea.style.height = "60px";
						textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
					}}
					onKeyDown={(event) => {
						if (event.key === "Escape") {
							event.preventDefault();
							event.currentTarget.blur();
						} else if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							shouldScrollToBottom.current = true;
							setHasNewMessages(false);
							if (watchedMessage.length == 0) return;
							event.currentTarget.form?.requestSubmit();
							event.currentTarget.style.height = "60px";
						}
					}}
				/>
			</HookedForm.Form>
			<ChatFileInput
				ref={sendImageModalRef}
				lastSubmitAttempt={lastSubmitAttempt}
				send={send}
				isDragging={isDragging}
			/>
		</ChatContainer>
	);
}
