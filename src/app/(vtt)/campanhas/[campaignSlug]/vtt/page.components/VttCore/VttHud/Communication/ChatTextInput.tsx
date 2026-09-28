import { HookedForm } from "@/libs/stp@forms";
import styles from "./ChatTextInput.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";
import { VttInputMessage } from "../../../Types/VttInputMessage";
import z from "zod";
import { Guid } from "@/libs/stp@types";
import { CHAT_SUBMIT_COOLDOWN_MS } from ".";
import { useVttInteractionContext } from "../../../Contexts/VttInteractionContextProvider";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";

const schema = z.object({
	message: z.string(),
});
type FormData = z.infer<typeof schema>;

interface ChatTextInputProps {
	send: (message: VttInputMessage) => void;
	lastSubmitAttempt: RefObject<number>;
	setHasNewMessages: Dispatch<SetStateAction<boolean>>;
	shouldScrollToBottom: RefObject<boolean>;
}
export function ChatTextInput({
	lastSubmitAttempt,
	send,
	setHasNewMessages,
	shouldScrollToBottom,
}: ChatTextInputProps) {
	const { setInteraction, interaction } = useVttInteractionContext();
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
			if (event.key !== "Enter" || !canOpenChat(event) || !chatInputRef.current)
				return;
			event.preventDefault();
			chatInputRef.current.focus();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
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
	);
}
