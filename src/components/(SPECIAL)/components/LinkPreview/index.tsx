"use client";

import {
	LinkPreviewIFrame,
	LinkPreviewIFrameProps,
} from "@/components/(SPECIAL)/components/LinkPreviewIFrame";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const StyledLinkPreviewActivatorArea = newStyledElement.span(
	styles.styledLinkPreviewActivatorArea
);
const StyledLinkPreviewContainer = newStyledElement.span(
	styles.styledLinkPreviewContainer
);

interface LinkPreviewProps extends LinkPreviewIFrameProps {
	left?: number;
	bottom?: number;
	debounce?: number;
}

export function LinkPreview({
	href,
	title,
	bottom = 5,
	left = 5,
	debounce = 700,
}: LinkPreviewProps) {
	const [showPreview, setShowPreview] = useState<boolean>(false);
	const [coords, setCoords] = useState<{ top: number; left: number }>({
		left: 0,
		top: 0,
	});
	const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
	const activatorRef = useRef<HTMLSpanElement | null>(null);

	const handleMouseEnter = () => {
		if (!activatorRef.current) return;
		hoverTimeout.current = setTimeout(() => {
			if (!activatorRef.current) return;
			const parentComponent = activatorRef.current.parentElement;
			if (!parentComponent) return;
			const rect = parentComponent.getBoundingClientRect();
			setCoords({
				top: rect.bottom + bottom,
				left: rect.left + left,
			});
			setShowPreview(true);
		}, debounce);
	};
	const handleMouseLeave = () => {
		if (hoverTimeout.current) {
			clearTimeout(hoverTimeout.current);
			hoverTimeout.current = null;
		}
		setShowPreview(false);
	};

	useEffect(() => {
		if (!activatorRef.current) return;
		const parentComponent = activatorRef.current.parentElement;
		if (!parentComponent) return;

		parentComponent.addEventListener("mouseenter", handleMouseEnter);
		parentComponent.addEventListener("mouseleave", handleMouseLeave);
		return () => {
			parentComponent.removeEventListener("mouseenter", handleMouseEnter);
			parentComponent.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [activatorRef]);

	useEffect(() => {
		const handleResize = () => {
			if (!activatorRef.current || !showPreview) return;
			const parentComponent = activatorRef.current!.parentElement;
			if (!parentComponent) return;
			const rect = parentComponent.getBoundingClientRect();
			setCoords({
				top: rect.bottom + bottom,
				left: rect.left + left,
			});
		};
		if (showPreview) {
			window.addEventListener("resize", handleResize);
			window.addEventListener("scroll", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
				window.removeEventListener("scroll", handleResize);
			};
		}
	}, [showPreview]);

	return (
		<>
			<StyledLinkPreviewActivatorArea ref={activatorRef} />
			{showPreview &&
				createPortal(
					<StyledLinkPreviewContainer
						style={{ left: coords.left, top: coords.top }}>
						<LinkPreviewIFrame
							href={href}
							title={title}
						/>
					</StyledLinkPreviewContainer>,
					document.body
				)}
		</>
	);
}
