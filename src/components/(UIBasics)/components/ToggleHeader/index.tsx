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
import { debounce } from "@/utils/General";
import { LazyLoadWrapper } from "@/components/(UTILS)/components/LazyLoadWrapper";

const ToggleHeaderContainer = newStyledElement.div(
	styles.toggleHeaderContainer,
);
const HeaderContainer = newStyledElement.div(styles.headerContainer);
const ToggleButtonHeaderContainer = newStyledElement.div(
	styles.toggleButtonHeaderContainer,
);
const ToggleButtonContainer = newStyledElement.div(
	styles.toggleButtonContainer,
);
const ResizeObservationContainer = newStyledElement.div(
	styles.resizeObservationContainer,
);
const ContentContainer = newStyledElement.div(styles.contentContainer);

function getCurrentOpenState(
	pathname: string,
	memoryName?: string,
): boolean | null {
	if (memoryName) {
		const memoryState = routeStorage.getItem(pathname, memoryName);
		if (!memoryState) return null;
		return memoryState === "true";
	}
	return false;
}
function setMemoryOpenState(value: boolean, pathname: string, name?: string) {
	if (name) {
		if (value) routeStorage.setItem(pathname, name, true);
		else routeStorage.setItem(pathname, name, false);
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
	defaultOpenState?: boolean;
	style?: CSSProperties;
	useCloseShortcut?: boolean;
	switchShortcutKey?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
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
	defaultOpenState = false,
	style,
	useCloseShortcut = false,
	switchShortcutKey,
}: ToggleHeaderProps) {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpenState);
	const [contentMaxHeight, setContentMaxHeight] = useState<number>(0);
	const closingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const observationContainerRef = useRef<HTMLDivElement>(null);

	const arrowRotationDegree = isOpen ? "180deg" : "90deg";
	const pathname = routeSensitiveMemory ? usePathname() : "";
	const memoryName = useMemo(() => {
		return memoryId && memoryId !== "" ? `Toggle/${memoryId}` : undefined;
	}, [memoryId]);

	const debouncedUpdateHeight = debounce(() => {
		if (!observationContainerRef.current) return;
		const newHeight = observationContainerRef.current.scrollHeight;
		if (newHeight != contentMaxHeight) setContentMaxHeight(newHeight);
	}, 10);

	function openContent() {
		if (closingTimeoutRef.current) {
			clearTimeout(closingTimeoutRef.current);
			closingTimeoutRef.current = null;
		}
		if (contentContainerRef.current)
			contentContainerRef.current.classList.add(styles.isOpen);
		setIsOpen(true);
	}
	function closeContent() {
		if (closingTimeoutRef.current) clearTimeout(closingTimeoutRef.current);
		closingTimeoutRef.current = setTimeout(() => {
			if (contentContainerRef.current)
				contentContainerRef.current.classList.remove(styles.isOpen);
		}, 600);
		setIsOpen(false);
	}

	useLayoutEffect(() => {
		debouncedUpdateHeight();
		const initialOpenState = getCurrentOpenState(pathname, memoryName);
		if (initialOpenState != null) {
			if (initialOpenState) openContent();
			else closeContent();
		}
	}, [debouncedUpdateHeight]);

	useLayoutEffect(() => {
		if (!observationContainerRef.current) return;
		const resizeObserver = new ResizeObserver(() => {
			debouncedUpdateHeight();
		});
		resizeObserver.observe(observationContainerRef.current);
		return () => resizeObserver.disconnect();
	}, [observationContainerRef, debouncedUpdateHeight]);

	function changeOpenState(newState: boolean) {
		setMemoryOpenState(newState, pathname, memoryName);
		if (newState) openContent();
		else closeContent();
	}

	useLayoutEffect(() => {
		if (!useCloseShortcut) return;
		function handleCloseShortcut(event: KeyboardEvent) {
			if (event.ctrlKey && event.shiftKey && event.key == "F")
				changeOpenState(false);
		}
		document.body.addEventListener("keydown", handleCloseShortcut);
		return () =>
			document.body.removeEventListener("keydown", handleCloseShortcut);
	}, [isOpen, pathname, memoryName]);
	useLayoutEffect(() => {
		if (!switchShortcutKey) return;
		function handleSwitchShortcut(event: KeyboardEvent) {
			if (
				event.ctrlKey &&
				event.shiftKey &&
				event.code == `Digit${switchShortcutKey}`
			)
				changeOpenState(!isOpen);
		}
		document.body.addEventListener("keydown", handleSwitchShortcut);
		return () =>
			document.body.removeEventListener("keydown", handleSwitchShortcut);
	}, [isOpen, pathname, memoryName]);

	const colorStyle = {
		...StandartColorKeysToProperties(textColor, backgroundColor),
		...style,
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
		<ToggleHeaderContainer style={colorStyle}>
			<HeaderContainer>
				<button
					onClick={() => {
						changeOpenState(!isOpen);
					}}
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
				className={defaultOpenState == true ? styles.isOpen : undefined}
				id={memoryId ? `UIBasics-toggle-${memoryId}` : undefined}
				ref={contentContainerRef}
				style={contentStyle}>
				<ResizeObservationContainer ref={observationContainerRef}>
					<LazyLoadWrapper children={children} />
				</ResizeObservationContainer>
			</ContentContainer>
		</ToggleHeaderContainer>
	);
}
