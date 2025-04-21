"use client";

import {
	ContentContainer,
	HeaderContainer,
	NotionToggleHeaderContainer,
} from "./styledElements";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { Triangle } from "@phosphor-icons/react/Triangle";
import {
	NotionText,
	NotionBackgroundColor,
	NotionPropsColor,
	NotionTextColor,
	NotionHeader,
} from "../../index";
import { routeStorage } from "@/utils/Storage";
import { usePathname } from "next/navigation";

interface NotionToggleHeaderProps extends NotionPropsColor {
	children?: ReactNode;
	headerType?: "h1" | "h2" | "h3" | "h4" | "h5";
	title?: string;
	titleColor?: keyof typeof NotionTextColor;
	titleAlign: "center" | "left" | "right" | undefined;
	contentMargin?: "none" | "middle" | "full";
	memoryId?: string;
	routeSensitiveMemory?: boolean;
}

export function NotionToggleHeader({
	children,
	headerType = "h1",
	title,
	contentMargin,
	memoryId,
	routeSensitiveMemory = true,
	titleColor,
	titleAlign,
	textColor,
	backgroundColor,
}: NotionToggleHeaderProps) {
	const memoryName =
		memoryId && memoryId !== "" ? `Toggle/${memoryId}` : undefined;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const arrowRotationDegree = isOpen ? "180deg" : "90deg";
	const pathname = routeSensitiveMemory ? usePathname() : "";

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
			marginTop: "0.25rem",
		}),
	};

	return (
		<NotionToggleHeaderContainer style={style}>
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
				<div>
					<NotionHeader
						textAlign={titleAlign}
						headerType={headerType}
						textColor={titleColor}
						children={title}
					/>
				</div>
			</HeaderContainer>
			<ContentContainer
				ref={contentRef}
				style={contentStyle}>
				{children}
			</ContentContainer>
		</NotionToggleHeaderContainer>
	);
}
