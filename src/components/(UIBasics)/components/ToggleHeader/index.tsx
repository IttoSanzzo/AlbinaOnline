"use client";

import {
	CSSProperties,
	ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { routeStorage } from "@/utils/Storage";
import { usePathname } from "next/navigation";
import { newStyledElement } from "@setsu-tp/styled-components";
import { StandartColorProps, StandartTextColor } from "../../core";
import { StandartColorKeysToProperties, UIBasics } from "../..";
import { Triangle } from "@phosphor-icons/react/dist/ssr/Triangle";
import styles from "./styles.module.css";

const ToggleHeaderContainer = newStyledElement.div(
	styles.toggleHeaderContainer
);
const HeaderContainer = newStyledElement.div(styles.headerContainer);
const ToggleButtonHeaderContainer = newStyledElement.div(
	styles.toggleButtonHeaderContainer
);
const ToggleButtonContainer = newStyledElement.div(
	styles.toggleButtonContainer
);
const ContentContainer = newStyledElement.div(styles.contentContainer);

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

interface ToggleHeaderProps extends StandartColorProps {
	children?: ReactNode;
	headerType?: "h1" | "h2" | "h3" | "h4" | "h5";
	title?: string;
	titleColor?: keyof typeof StandartTextColor;
	titleAlign?: CSSProperties["textAlign"];
	contentMargin?: "none" | "middle" | "full";
	memoryId?: string;
	routeSensitiveMemory?: boolean;
}
export function ToggleHeader({
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
}: ToggleHeaderProps) {
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

	const colorStyle = StandartColorKeysToProperties(textColor, backgroundColor);
	const contentStyle: CSSProperties = {
		minHeight: 0,
		maxHeight: isOpen ? `${contentMaxHeight}px` : 0,
		...(contentMargin &&
			contentMargin != "full" && {
				marginLeft: contentMargin == "middle" ? "12.5px" : 0,
			}),
	};

	return (
		<ToggleHeaderContainer style={colorStyle}>
			<HeaderContainer>
				<button
					onClick={handleOpenButton}
					aria-expanded={isOpen}
					aria-controls={`UIBasics-toggle-${memoryId ?? "content"}`}
					aria-label="Toggle content">
					<ToggleButtonContainer>
						<Triangle
							size={11}
							weight="fill"
							color={
								textColor
									? StandartTextColor[textColor]
									: StandartTextColor.default
							}
							style={{ rotate: arrowRotationDegree }}
						/>
					</ToggleButtonContainer>
					<ToggleButtonHeaderContainer>
						<UIBasics.Header
							textAlign={titleAlign}
							headerType={headerType}
							textColor={titleColor ? titleColor : "default"}
							children={title}
						/>
					</ToggleButtonHeaderContainer>
				</button>
			</HeaderContainer>
			<ContentContainer
				id={`UIBasics-toggle-${memoryId ?? "content"}`}
				ref={contentRef}
				style={contentStyle}>
				{children}
			</ContentContainer>
		</ToggleHeaderContainer>
	);
}
