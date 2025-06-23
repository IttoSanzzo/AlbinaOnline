"use client";

import {
	ContentContainer,
	HeaderContainer,
	NotionToggleContainer,
} from "./styledElements";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { Triangle } from "@phosphor-icons/react/Triangle";
import {
	NotionText,
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
} from "../../index";
import { routeStorage } from "@/utils/Storage";
import { usePathname } from "next/navigation";

interface NotionToggleProps extends NotionPropsColor {
	children?: ReactNode;
	title?: ReactNode | string;
	titleColor?: keyof typeof NotionTextColor;
	contentMargin?: "none" | "middle" | "full";
	memoryId?: string;
	routeSensitiveMemory?: boolean;
}

export function NotionToggle({
	children,
	title,
	contentMargin,
	memoryId,
	routeSensitiveMemory = true,
	titleColor,
	textColor,
	backgroundColor,
}: NotionToggleProps) {
	const memoryName =
		memoryId && memoryId !== "" ? `Toggle/${memoryId}` : undefined;
	const pathname = routeSensitiveMemory ? usePathname() : "";
	const memoryState = memoryName
		? routeStorage.getItem(pathname, memoryName)
		: undefined;
	const isMemoryStateOpen = memoryState === "true" ? true : false;
	const [isOpen, setIsOpen] = useState<boolean>(isMemoryStateOpen);
	const contentRef = useRef<HTMLDivElement>(null);
	const arrowRotationDegree = isOpen ? "180deg" : "90deg";

	function handleOpenButton() {
		if (memoryName) {
			if (isOpen) routeStorage.removeItem(pathname, memoryName);
			else routeStorage.setItem(pathname, memoryName, true);
		}
		setIsOpen(!isOpen);
	}

	useEffect(() => {
		if (memoryName) {
			const memoryState = routeStorage.getItem(pathname, memoryName);
			if (memoryState) {
				const isMemoryStateOpen = memoryState === "true" ? true : false;
				setIsOpen(isMemoryStateOpen);
			}
		}
	}, []);

	const style: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};
	const contentStyle: CSSProperties = {
		...(contentMargin &&
			contentMargin != "full" && {
				marginLeft: contentMargin == "middle" ? "12.5px" : 0,
			}),
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
