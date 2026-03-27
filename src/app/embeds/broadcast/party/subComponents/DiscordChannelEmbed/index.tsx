"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import { CSSProperties, useEffect, useRef } from "react";
import stylesModule from "./styles.module.css";
import { createRoot } from "react-dom/client";

const EmbedContainer = newStyledElement.div(stylesModule.embedContainer);

interface DiscordChannelEmbedProps {
	styles?: CSSProperties;
	serverId: string;
	channelId: string;
}
export function DiscordChannelEmbed({
	channelId,
	serverId,
	styles,
}: DiscordChannelEmbedProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const root = createRoot(containerRef.current);
		root.render(
			<iframe
				src={`https://e.widgetbot.io/channels/${serverId}/${channelId}`}
				allow="clipboard-write; fullscreen"
				height={"100%"}
				width={"100%"}
			/>,
		);
		return () => {
			root.unmount();
		};
	}, [containerRef]);

	return (
		<EmbedContainer style={styles}>
			<div ref={containerRef} />
		</EmbedContainer>
	);
}
