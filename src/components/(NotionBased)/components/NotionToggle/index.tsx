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
	useEffect,
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
function setMemoryOpenState(value: boolean, pathname: string, name?: string) {
	if (name) {
		if (value) routeStorage.setItem(pathname, name, true);
		else routeStorage.removeItem(pathname, name);
	}
}

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
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [contentMaxHeight, setContentMaxHeight] = useState<number>(0);

	const arrowRotationDegree = isOpen ? "180deg" : "90deg";
	const pathname = routeSensitiveMemory ? usePathname() : "";
	const memoryName = useMemo(() => {
		return memoryId && memoryId !== "" ? `Toggle/${memoryId}` : undefined;
	}, [memoryId]);
	const contentRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		setIsOpen(getCurrentOpenState(pathname, memoryName));
	}, []);

	function updateHeight() {
		if (!contentRef.current) return;
		const newHeight = contentRef.current!.scrollHeight;
		if (newHeight != contentMaxHeight) setContentMaxHeight(newHeight);
	}

	useLayoutEffect(() => {
		if (!contentRef.current) return;
		const element = contentRef.current!;
		const resizeObserver = new ResizeObserver(updateHeight);
		if (element.firstElementChild)
			resizeObserver.observe(element.firstElementChild);
		return () => {
			resizeObserver.disconnect();
		};
	}, [contentRef]);

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
		maxHeight: isOpen ? `${contentMaxHeight}px` : 0,
		...(contentMargin &&
			contentMargin != "full" && {
				marginLeft: contentMargin == "middle" ? "12.5px" : 0,
			}),
	};

	return (
		<NotionToggleContainer style={colorStyle}>
			<HeaderContainer>
				<button
					style={colorStyle}
					onClick={handleOpenButton}
					aria-expanded={isOpen}
					aria-controls={`notion-toggle-${memoryId ?? "content"}`}
					aria-label="Toggle content">
					<ToggleButtonContainer>
						<Triangle
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
				id={`notion-toggle-${memoryId ?? "content"}`}
				ref={contentRef}
				style={contentStyle}>
				{children}
			</ContentContainer>
		</NotionToggleContainer>
	);
}
