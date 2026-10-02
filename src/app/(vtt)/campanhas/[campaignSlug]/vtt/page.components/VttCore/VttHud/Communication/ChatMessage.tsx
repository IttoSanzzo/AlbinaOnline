import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./ChatMessage.module.css";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { CampaignMember, Guid } from "@/libs/stp@types";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ChatMessageContextMenu } from "./ChatMessageContextMenu";

const ChatMessageContainer = newStyledElement.div(styles.chatMessageContainer);
const ChatMessageAuthor = newStyledElement.div(styles.chatMessageAuthor);
const ChatMessageContent = newStyledElement.div(styles.chatMessageContent);
const EmbedImageLinkContainer = newStyledElement.a(
	styles.embedImageLinkContainer,
);
const ReplyContainer = newStyledElement.div(styles.replyContainer);
const ReplyCurvedLineSpan = newStyledElement.span(styles.replyCurvedLineSpan);
const ReplyContent = newStyledElement.div(styles.replyContent);
const ReplyText = newStyledElement.p(styles.replyText);

const CHAT_URL_REGEX = /https?:\/\/[^\s<]+/gi;
const CHAT_IMAGE_EXTENSIONS = [
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".bmp",
	".svg",
];
const CHAT_VIDEO_EXTENSIONS = [".mp4"];

type ChatMediaType = "image" | "video" | "unknown";

function isImageUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return CHAT_IMAGE_EXTENSIONS.some((extension) =>
			url.pathname.toLowerCase().endsWith(extension),
		);
	} catch {
		return false;
	}
}
function isVideoUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return CHAT_VIDEO_EXTENSIONS.some((extension) =>
			url.pathname.toLowerCase().endsWith(extension),
		);
	} catch {
		return false;
	}
}
function getYoutubeVideoId(value: string): string | null {
	try {
		const url = new URL(value);
		if (url.hostname === "youtu.be") return url.pathname.slice(1) || null;
		if (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") {
			if (url.pathname === "/watch") return url.searchParams.get("v");
			if (url.pathname.startsWith("/shorts/"))
				return url.pathname.split("/")[2] || null;
			if (url.pathname.startsWith("/embed/"))
				return url.pathname.split("/")[2] || null;
		}
		return null;
	} catch {
		return null;
	}
}
async function resolveMediaType(url: string): Promise<ChatMediaType> {
	if (isImageUrl(url)) return "image";
	if (isVideoUrl(url)) return "video";
	try {
		const response = await fetch(url, {
			method: "HEAD",
		});
		if (!response.ok) return "unknown";
		const contentType = response.headers.get("content-type")?.toLowerCase();
		if (contentType?.startsWith("image/")) return "image";
		if (contentType?.startsWith("video/")) return "video";
	} catch {
		return "unknown";
	}
	return "unknown";
}

interface ChatMessageContentProps {
	text: string;
}
function ChatMessageContentRenderer({ text }: ChatMessageContentProps) {
	const [mediaTypes, setMediaTypes] = useState<Record<string, ChatMediaType>>(
		{},
	);

	useEffect(() => {
		let cancelled = false;
		const urls = [...text.matchAll(CHAT_URL_REGEX)].map((match) => match[0]);

		const unresolvedUrls = urls.filter(
			(url) =>
				!isImageUrl(url) &&
				!isVideoUrl(url) &&
				!getYoutubeVideoId(url) &&
				mediaTypes[url] === undefined,
		);
		if (unresolvedUrls.length === 0) return;
		Promise.all(
			unresolvedUrls.map(async (url) => {
				const type = await resolveMediaType(url);
				return [url, type] as const;
			}),
		).then((results) => {
			if (cancelled) return;
			setMediaTypes((current) => ({
				...current,
				...Object.fromEntries(results),
			}));
		});
		return () => {
			cancelled = true;
		};
	}, [text, mediaTypes]);

	const parts: React.ReactNode[] = [];

	let lastIndex = 0;
	for (const match of text.matchAll(CHAT_URL_REGEX)) {
		const url = match[0];
		const index = match.index ?? 0;
		if (index > lastIndex) parts.push(text.slice(lastIndex, index));
		const youtubeVideoId = getYoutubeVideoId(url);
		const mediaType = isImageUrl(url)
			? "image"
			: isVideoUrl(url)
				? "video"
				: mediaTypes[url];

		if (mediaType === "image") {
			parts.push(
				<EmbedImageLinkContainer
					{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
					key={`image-${index}`}
					className={parts.length == 0 ? styles.firstEmbed : undefined}
					href={url}
					target="_blank"
					rel="noopener noreferrer">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={url}
						alt="Imagem enviada no chat"
						className={styles.chatImage}
					/>
				</EmbedImageLinkContainer>,
			);
		} else if (mediaType === "video") {
			parts.push(
				<video
					{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
					key={`video-${index}`}
					className={clsx(
						styles.embedVideoContainer,
						styles.chatVideo,
						parts.length == 0 ? styles.firstEmbed : undefined,
					)}
					controls
					preload="metadata"
					playsInline>
					<source src={url} />
				</video>,
			);
		} else if (youtubeVideoId) {
			parts.push(
				<iframe
					{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
					key={`youtube-${index}`}
					className={clsx(
						styles.chatYoutube,
						parts.length == 0 ? styles.firstEmbed : undefined,
					)}
					src={`https://www.youtube.com/embed/${youtubeVideoId}`}
					title="Vídeo do YouTube"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowFullScreen
				/>,
			);
		} else {
			parts.push(
				<a
					{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
					key={`link-${index}`}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className={clsx(
						styles.chatLink,
						parts.length == 0 ? styles.firstEmbed : undefined,
					)}>
					{url}
				</a>,
			);
		}
		lastIndex = index + url.length;
	}
	if (lastIndex < text.length) parts.push(text.slice(lastIndex));
	return parts;
}

interface ChatMessageProps {
	message: VttChatMessage;
	member?: CampaignMember;
	messageToReply?: VttChatMessage;
	messageToReplyMember?: CampaignMember;
	messageToReplyIdState: [
		Guid | undefined,
		Dispatch<SetStateAction<Guid | undefined>>,
	];
	members: CampaignMember[];
}
export function ChatMessage({
	message,
	member,
	messageToReply,
	messageToReplyMember,
	messageToReplyIdState: [, setMessageToReplyId],
	members,
}: ChatMessageProps) {
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);

	return (
		<ChatMessageContainer
			id={`vtt-chatmessage|${message.id}`}
			data-chat-context-menu-open={contextMenuPosition != null}
			onContextMenu={(event) => {
				event.preventDefault();
				setContextMenuPosition({
					x: event.clientX,
					y: event.clientY,
				});
			}}>
			{message.messageToReplyId && (
				<ReplyContainer>
					<ReplyCurvedLineSpan />
					<ReplyContent
						{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
						{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
						onClick={(event) => {
							event.preventDefault();
							const messageElement = document.getElementById(
								`vtt-chatmessage|${message.messageToReplyId}`,
							);
							if (!messageElement) return;
							messageElement.scrollIntoView({
								behavior: "smooth",
								block: "start",
								inline: "start",
							});
						}}>
						<MessageAuthor
							member={messageToReplyMember}
							message={messageToReply}
							isReply
						/>
						<ReplyText
							className={messageToReply ? undefined : styles.deleted}
							style={
								messageToReply && messageToReply.recipients.length > 0
									? { color: "var(--cl-mauve-900)" }
									: undefined
							}>
							{messageToReply?.text ?? "Removido"}
						</ReplyText>
					</ReplyContent>
				</ReplyContainer>
			)}
			<MessageAuthor
				member={member}
				message={message}
				setMessageToReplyId={setMessageToReplyId}
				title={`${new Date(message.timestamp).toLocaleString("pt-BR", {
					dateStyle: "long",
					timeStyle: "short",
				})}${
					message.recipients.length > 0
						? message.recipients.length == 1
							? "\n\nPrivado"
							: `\n\nRecipientes:${message.recipients
									.filter((recipientId) => recipientId != message.userId)
									.map(
										(recipientId) =>
											`\n  ${members.find((member) => member.userId == recipientId)?.user.nickname ?? "???"}`,
									)}`
						: ""
				}`}
			/>
			{"  "}
			<ChatMessageContent
				style={
					message.recipients.length > 0
						? { color: "var(--cl-mauve-900)" }
						: undefined
				}>
				<ChatMessageContentRenderer text={message.text} />
			</ChatMessageContent>
			{contextMenuPosition && (
				<ChatMessageContextMenu
					position={contextMenuPosition}
					messageId={message.id}
					messageAuthorId={message.userId}
					closeContextMenu={() => setContextMenuPosition(null)}
					onReply={() => setMessageToReplyId(message.id)}
				/>
			)}
		</ChatMessageContainer>
	);
}

interface MessageAuthorProps {
	message?: VttChatMessage;
	member?: CampaignMember;
	setMessageToReplyId?: Dispatch<SetStateAction<Guid | undefined>>;
	title?: string;
	isReply?: boolean;
}
function MessageAuthor({
	message,
	member,
	setMessageToReplyId,
	title,
	isReply = false,
}: MessageAuthorProps) {
	return (
		<ChatMessageAuthor
			{...(setMessageToReplyId &&
				setVttElementHoverInteraction(VttCursorInteractionType.CornerUpLeft))}
			title={title}
			style={{
				background: `linear-gradient(10deg, ${message?.color1 ?? "#FFFFFF"}, ${message?.color2 ?? "#000000"})`,
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
				fontSize: isReply ? "var(--fs-xs)" : undefined,
			}}
			onDoubleClick={
				setMessageToReplyId
					? () => {
							if (message) setMessageToReplyId(message.id);
						}
					: undefined
			}>
			{member && (
				<Image
					src={member.user.iconUrl}
					alt={""}
					width={isReply ? 15 : 18}
					height={isReply ? 15 : 18}
					className={styles.chatMessageAuthorImage}
				/>
			)}
			{member?.user.nickname ?? "???"}
		</ChatMessageAuthor>
	);
}
