"use client";

import { StyledLink, StyledLinkProps } from "@/components/(Design)";
import { DragButton, SortableLinkContainer } from "./styledElements";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";

interface SortableLinkProps {
	linkProps: StyledLinkProps;
}
export function SortableStyledLink({ linkProps }: SortableLinkProps) {
	const stableIdRef = useRef(linkProps.href ?? crypto.randomUUID());
	const id = stableIdRef.current;

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<SortableLinkContainer
			ref={setNodeRef}
			style={style}
			{...attributes}>
			<StyledLink {...linkProps} />
			<DragButton {...listeners}>☰</DragButton>
		</SortableLinkContainer>
	);
}
