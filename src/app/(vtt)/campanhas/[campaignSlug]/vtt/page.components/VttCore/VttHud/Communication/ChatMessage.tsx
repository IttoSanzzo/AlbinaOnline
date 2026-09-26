import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./ChatMessage.module.css";
import { VttChatMessage } from "../../../Types/Classes/ChatMessage";
import { CampaignMember } from "@/libs/stp@types";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import clsx from "clsx";
import { useEffect, useState } from "react";

const ChatMessageContainer = newStyledElement.div(styles.chatMessageContainer);
const ChatMessageAuthor = newStyledElement.div(styles.chatMessageAuthor);
const ChatMessageContent = newStyledElement.div(styles.chatMessageContent);
const EmbedImageLinkContainer = newStyledElement.a(
	styles.embedImageLinkContainer,
);

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
					className={clsx(styles.embedVideoContainer, styles.chatVideo)}
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
					className={styles.chatYoutube}
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
					className={styles.chatLink}>
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
	member: CampaignMember | undefined;
}

export function ChatMessage({ message, member }: ChatMessageProps) {
	return (
		<ChatMessageContainer>
			<ChatMessageAuthor
				style={{
					background: `linear-gradient(10deg, ${message.color1}, ${message.color2})`,
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}}>
				{member?.user.nickname ?? "???"}
			</ChatMessageAuthor>
			:{" "}
			<ChatMessageContent>
				<ChatMessageContentRenderer text={message.text} />
			</ChatMessageContent>
		</ChatMessageContainer>
	);
}
