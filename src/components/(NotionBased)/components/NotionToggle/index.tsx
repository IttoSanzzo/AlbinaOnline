"use client";

import {
	ContentContainer,
	HeaderContainer,
	NotionToggleContainer,
	ToggleButtonContainer,
} from "./styledElements";
import {
	CSSProperties,
	ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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

function getCurrentOpenState(pathname: string, memoryName?: string) {
	if (memoryName) {
		const memoryState: string | null = routeStorage.getItem(
			pathname,
			memoryName
		);
		if (memoryState) {
			return memoryState === "true";
		}
	}
	return false;
}
function setMemoryOpenState(
	newValue: boolean,
	pathname: string,
	memoryName?: string
) {
	if (memoryName) {
		if (newValue) routeStorage.setItem(pathname, memoryName, true);
		else routeStorage.removeItem(pathname, memoryName);
	}
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
	const pathname = routeSensitiveMemory ? usePathname() : "";
	const memoryName = useMemo(() => {
		return memoryId && memoryId !== "" ? `Toggle/${memoryId}` : undefined;
	}, [memoryId]);
	const [isOpen, setIsOpen] = useState<boolean>(
		getCurrentOpenState(pathname, memoryName)
	);
	const arrowRotationDegree = isOpen ? "180deg" : "90deg";
	const contentRef = useRef<HTMLDivElement>(null);

	if (memoryId == "InfoDescription") {
		console.log(`${isOpen} ${memoryId}`);
		console.log(isOpen);
	}

	useLayoutEffect(() => {
		if (isOpen && contentRef.current) {
			contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
		}
	}, [isOpen]);

	function handleOpenButton() {
		setMemoryOpenState(!isOpen, pathname, memoryName);
		setIsOpen(!isOpen);
	}

	const colorStyle: CSSProperties = {
		...(textColor && { color: NotionTextColor[textColor] }),
		...(backgroundColor && {
			backgroundColor: NotionBackgroundColor[backgroundColor],
		}),
	};
	const contentStyle: CSSProperties = {
		minHeight: 0,
		...(contentMargin &&
			contentMargin != "full" && {
				marginLeft: contentMargin == "middle" ? "12.5px" : 0,
			}),
		...(!isOpen && {
			height: 0,
		}),
		...(isOpen &&
			contentRef.current != null && {
				height: `${contentRef.current!.scrollHeight}px`,
			}),
	};

	return (
		<NotionToggleContainer style={colorStyle}>
			<HeaderContainer>
				<button
					style={colorStyle}
					suppressHydrationWarning
					onClick={handleOpenButton}
					aria-expanded={isOpen}
					aria-controls={`notion-toggle-${memoryId ?? "content"}`}
					aria-label="Toggle content">
					<ToggleButtonContainer>
						<Triangle
							suppressHydrationWarning
							size={11}
							weight="fill"
							color={
								textColor ? NotionTextColor[textColor] : NotionTextColor.default
							}
							style={{ rotate: arrowRotationDegree }}
						/>
					</ToggleButtonContainer>
					{typeof title === "string" ? (
						<NotionText textColor={titleColor}>{title}</NotionText>
					) : (
						title
					)}
				</button>
			</HeaderContainer>
			<ContentContainer
				suppressHydrationWarning
				id={`notion-toggle-${memoryId ?? "content"}`}
				ref={contentRef}
				style={contentStyle}>
				{children}
			</ContentContainer>
		</NotionToggleContainer>
	);
}
