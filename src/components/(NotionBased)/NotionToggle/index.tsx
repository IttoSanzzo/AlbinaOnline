"use client";

import {
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "@/utils/NotionBasedUtils";
import {
	ContentContainer,
	HeaderContainer,
	NotionToggleContainer,
} from "./styledElements";
import { CSSProperties, ReactNode, useRef, useState } from "react";
import { Triangle } from "@phosphor-icons/react/Triangle";
import NotionText from "../NotionText";

interface NotionToggleProps extends NotionPropsColor {
	children?: ReactNode;
	title?: ReactNode | string;
	titleColor?: keyof typeof NotionTextColor;
}

export default function NotionToggle({
	children,
	title,
	titleColor,
	textColor,
	backgroundColor,
}: NotionToggleProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const arrowRotationDegree = isOpen ? "180deg" : "90deg";

	function handleOpenButton() {
		setIsOpen(!isOpen);
	}

	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};
	const contentStyle: CSSProperties = {
		...(!isOpen && {
			height: 0,
			minHeight: 0,
		}),
		...(isOpen && {
			height: `${contentRef.current!.scrollHeight}px`,
		}),
	};

	return (
		<NotionToggleContainer style={style}>
			<HeaderContainer>
				<button onClick={handleOpenButton}>
					<Triangle
						size={11}
						weight="fill"
						color={
							textColor ? NotionTextColor[textColor] : NotionTextColor.default
						}
						style={{ rotate: arrowRotationDegree }}
					/>
				</button>
				{typeof title === "string" ? (
					<NotionText textColor={titleColor}>{title}</NotionText>
				) : (
					title
				)}
			</HeaderContainer>
			<ContentContainer
				ref={contentRef}
				style={contentStyle}>
				{children}
			</ContentContainer>
		</NotionToggleContainer>
	);
}
