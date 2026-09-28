"use client";

import z from "zod";
import { VttInputMessage } from "../../../Types/VttInputMessage";
import styles from "./ChatFileInput.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dispatch,
	forwardRef,
	RefObject,
	SetStateAction,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { CHAT_SUBMIT_COOLDOWN_MS } from ".";
import { Guid } from "@/libs/stp@types";
import { HookedForm } from "@/libs/stp@forms";
import { extractImageFromDrop } from "@/libs/stp@forms/components/ImageInput/utils";
import { ImageInputHandle } from "@/libs/stp@forms/components/ImageInput";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StpIcon } from "@/libs/stp@icons";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";

const SendImageTrigger = newStyledElement.button(styles.sendImageTrigger);

const schema = z.object({
	image: z.instanceof(File),
});
type FormData = z.infer<typeof schema>;

export interface SendDraggedImageToChatHandle {
	openByDragEvent: (event: React.DragEvent) => Promise<void>;
}

interface ChatFileInputProps {
	send: (message: VttInputMessage) => void;
	lastSubmitAttempt: RefObject<number>;
	isDragging: boolean;
	messageToReplyIdState: [
		Guid | undefined,
		Dispatch<SetStateAction<Guid | undefined>>,
	];
	messageToReply?: VttChatMessage;
}
export const ChatFileInput = forwardRef<
	SendDraggedImageToChatHandle,
	ChatFileInputProps
>(function ChatFileInput(
	{
		send,
		lastSubmitAttempt,
		isDragging,
		messageToReplyIdState: [messageToReplyId, setMessageToReplyIdState],
		messageToReply,
	}: ChatFileInputProps,
	ref,
) {
	const [pendingImage, setPendingImage] = useState<File | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	const imageInputRef = useRef<ImageInputHandle | null>(null);
	const handleImageInputRef = (node: ImageInputHandle | null) => {
		imageInputRef.current = node;
		if (node && pendingImage)
			node.setImage(pendingImage).then(() => {
				setPendingImage(null);
			});
	};

	const form = useForm<FormData>({
		mode: "all",
		resolver: zodResolver(schema),
	});
	async function handleSubmit(data: FormData) {
		const now = Date.now();
		if (now - lastSubmitAttempt.current < CHAT_SUBMIT_COOLDOWN_MS) {
			form.reset();
			setOpen(false);
			return;
		}
		lastSubmitAttempt.current = now;

		const file = data.image;
		if (!(file instanceof File)) return;

		lastSubmitAttempt.current = now;

		try {
			const bodyData = new FormData();
			bodyData.append("file", file);
			const response = await fetch(
				"https://aisenseapi.com/services/v1/storage",
				{
					method: "POST",
					body: bodyData,
				},
			);
			if (!response.ok)
				throw new Error(
					`Failed to upload chat file: ${response.status} ${response.statusText}`,
				);
			const result = await response.json();
			if (!result.storage_url)
				throw new Error("Upload response did not contain a storage URL.");
			send({
				id: Guid.NewGuid(),
				type: "PostChatMessage",
				data: {
					text: result.storage_url,
					messageToReplyId: messageToReplyId,
					recipients: messageToReply ? messageToReply.recipients : undefined,
				},
			});
		} catch (error) {
			console.error("Failed to upload chat file.", error);
		} finally {
			form.reset();
			if (messageToReplyId) setMessageToReplyIdState(undefined);
			setOpen(false);
		}
	}

	useEffect(() => {
		if (!open || !imageInputRef.current || !pendingImage) return;
		const current = pendingImage;
		imageInputRef.current.setImage(current).then(() => {
			setPendingImage(null);
		});
	}, [pendingImage, open]);
	useImperativeHandle(
		ref,
		() => ({
			openByDragEvent: async (event: React.DragEvent): Promise<void> => {
				const image = await extractImageFromDrop(event);
				if (!image) return;
				setPendingImage(image);
				setOpen(true);
			},
		}),
		[],
	);

	return (
		<Dialog.Root
			open={open}
			onOpenChange={setOpen}>
			<Dialog.Trigger
				asChild
				style={{
					display: isDragging ? "unset" : "none",
				}}>
				<SendImageTrigger>
					{StpIcon({ name: "Upload", color: "yellow", style: "bold" })}
				</SendImageTrigger>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className={styles.overlay}>
					<Dialog.Content>
						<Dialog.Title textAlign="center">Enviando Arquivo</Dialog.Title>
						<DialogDescription />
						<HookedForm.Form<FormData>
							form={form}
							onSubmit={handleSubmit}>
							<HookedForm.ImageInput<FormData>
								ref={handleImageInputRef}
								label="Insira sua imagem"
								fieldName="image"
								maxSize={8_368_608}
							/>
							<HookedForm.SubmitButton
								label="Enviar"
								ref={(element) => {
									element?.focus();
								}}
							/>
						</HookedForm.Form>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
});
