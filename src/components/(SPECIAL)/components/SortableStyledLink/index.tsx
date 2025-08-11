"use client";

import { StyledLink, StyledLinkProps } from "@/components/(Design)";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const SortableLinkContainer = newStyledElement.div(
	styles.sortableLinkContainer
);
const DragButton = newStyledElement.button(styles.dragButton);

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
