import { HookedForm } from "@/libs/stp@forms";
import styles from "./ChatTextInput.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { VttInputMessage } from "../../../Types/VttInputMessage";
import z from "zod";
import { CampaignMember, Guid } from "@/libs/stp@types";
import { CHAT_SUBMIT_COOLDOWN_MS } from ".";
import { useVttInteractionContext } from "../../../Contexts/VttInteractionContextProvider";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { VttCommandLineHandler } from "./VttCommandLineHandler";
import { useVttViewportContext } from "../../../Contexts/VttViewportContextProvider";
import { useCurrentUser } from "@/libs/stp@hooks";
import { KlipyGifSelector } from "./KlipyGifSelector";

const ChatTextInputContainer = newStyledElement.div(
	styles.chatTextInputContainer,
);
const ReplyContainer = newStyledElement.div(styles.replyContainer);
const ReplyMessageContent = newStyledElement.span(styles.replyMessageContent);
const ReplyMessageAuthor = newStyledElement.span(styles.replyMessageAuthor);
const CancelReplyButton = newStyledElement.button(styles.cancelReplyButton);
const ChatFormContainer = newStyledElement.div(styles.chatFormContainer);

const schema = z.object({
	message: z.string(),
});
type FormData = z.infer<typeof schema>;

interface ChatTextInputProps {
	send: (message: VttInputMessage) => void;
	lastSubmitAttempt: RefObject<number>;
	setHasNewMessages: Dispatch<SetStateAction<boolean>>;
	shouldScrollToBottom: RefObject<boolean>;
	messageToReplyIdState: [
		Guid | undefined,
		Dispatch<SetStateAction<Guid | undefined>>,
	];
	messageToReply?: VttChatMessage;
	messageToReplyMember?: CampaignMember;
	members: CampaignMember[];
	allChatMessages: VttChatMessage[];
}
export function ChatTextInput({
	lastSubmitAttempt,
	send,
	setHasNewMessages,
	shouldScrollToBottom,
	messageToReplyIdState: [messageToReplyId, setMessageToReplyId],
	messageToReplyMember,
	messageToReply,
	members,
	allChatMessages,
}: ChatTextInputProps) {
	const { setInteraction, interaction } = useVttInteractionContext();
	const { screenToWorld } = useVttViewportContext();
	const { user } = useCurrentUser();
	const [isGifSelectorOpen, setIsGifSelectorOpen] = useState(false);
	const chatInputRef = useRef<HTMLTextAreaElement>(null);

	const form = useForm<FormData>({
		mode: "all",
		resolver: zodResolver(schema),
		defaultValues: {
			message: "",
		},
	});
	const watchedMessage = (form.watch().message ?? "").trim();

	async function handleSubmit(data: FormData) {
		let shouldReset: boolean = false;
		try {
			const now = Date.now();
			if (now - lastSubmitAttempt.current < CHAT_SUBMIT_COOLDOWN_MS) return;
			lastSubmitAttempt.current = now;
			if (data.message.trim().length == 0) return;
			const result = await VttCommandLineHandler({
				text: data.message,
				userId: user?.id ?? Guid.Empty,
				messageToReplyId: messageToReplyId,
				messageToReply: messageToReply,
				members: members,
				send: send,
				screenToWorld: screenToWorld,
				allChatMessages: allChatMessages,
			});
			shouldReset = result.shouldReset ?? false;
			if (result.type)
				send({
					id: Guid.NewGuid(),
					path: "/chat/messages",
					method: "Post",
					data: result.data ?? {},
				});
		} catch (error) {
			console.error("Failed to upload chat file.", error);
		} finally {
			if (shouldReset) {
				form.reset();
				if (messageToReplyId) setMessageToReplyId(undefined);
			}
		}
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

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (
				(event.key !== "Enter" && event.key !== "/") ||
				!canOpenChat(event) ||
				!chatInputRef.current
			)
				return;
			event.preventDefault();
			if (event.key === "/") form.setValue("message", "/");
			chatInputRef.current.focus();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	useEffect(() => {
		if (!messageToReplyId || !chatInputRef.current) return;
		chatInputRef.current.focus();
	}, [messageToReplyId]);

	return (
		<ChatTextInputContainer>
			{messageToReplyId && (
				<ReplyContainer>
					<ReplyMessageContent>
						Respondendo a{" "}
						<ReplyMessageAuthor
							style={{
								background: `linear-gradient(10deg, ${messageToReply?.color1 ?? "#FFFFFF"}, ${messageToReply?.color2 ?? "#000000"})`,
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}>
							{messageToReplyMember?.user.nickname ?? "???"}
						</ReplyMessageAuthor>
					</ReplyMessageContent>
					<CancelReplyButton
						{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
						onClick={(event) => {
							event.preventDefault();
							setMessageToReplyId(undefined);
						}}>
						Cancelar
					</CancelReplyButton>
				</ReplyContainer>
			)}
			<ChatFormContainer>
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
								if (messageToReplyId) setMessageToReplyId(undefined);
								else event.currentTarget.blur();
							} else if (event.key === "Enter" && !event.shiftKey) {
								event.preventDefault();
								shouldScrollToBottom.current = true;
								setHasNewMessages(false);
								if (watchedMessage.length == 0) return;
								event.currentTarget.form?.requestSubmit();
								event.currentTarget.style.height = "60px";
							} else if (event.ctrlKey && event.key.toLowerCase() == "g") {
								event.preventDefault();
								event.stopPropagation();
								setIsGifSelectorOpen(!isGifSelectorOpen);
							}
						}}
					/>
				</HookedForm.Form>
				<KlipyGifSelector
					isGifSelectorOpenState={[isGifSelectorOpen, setIsGifSelectorOpen]}
					chatForm={form}
					submitChatHandler={handleSubmit}
					chatInputRef={chatInputRef}
				/>
			</ChatFormContainer>
		</ChatTextInputContainer>
	);
}
