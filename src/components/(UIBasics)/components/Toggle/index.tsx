"use client";

import { debounce } from "@/utils/General";
import { routeStorage } from "@/utils/Storage";
import { Triangle } from "@phosphor-icons/react/dist/ssr/Triangle";
import { newStyledElement } from "@setsu-tp/styled-components";
import { usePathname } from "next/navigation";
import {
	CSSProperties,
	ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { UIBasics } from "../..";
import { StandartColorProps, StandartTextColor } from "../../core";
import { StandartColorKeysToProperties } from "../../utils";
import styles from "./styles.module.css";
import { LazyLoadWrapper } from "@/components/(UTILS)/components/LazyLoadWrapper";

const ToggleContainer = newStyledElement.div(styles.toggleContainer);
const HeaderContainer = newStyledElement.div(styles.headerContainer);
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

interface ToggleProps extends StandartColorProps {
	children?: ReactNode;
	title?: ReactNode | string;
	titleColor?: keyof typeof StandartTextColor;
	contentMargin?: "none" | "middle" | "full";
	memoryId?: string;
	routeSensitiveMemory?: boolean;
	defaultOpenState?: boolean;
	id?: string;
	floatingReverseButton?: boolean;
	withoutPadding?: boolean;
	style?: CSSProperties;
	buttonStyle?: CSSProperties;
}
export function Toggle({
	children,
	title,
	contentMargin,
	memoryId,
	routeSensitiveMemory = true,
	titleColor,
	textColor,
	backgroundColor,
	defaultOpenState = false,
	id,
	style,
	buttonStyle,
	floatingReverseButton = false,
	withoutPadding = false,
}: ToggleProps) {
	const [isOpen, setIsOpen] = useState<boolean>(defaultOpenState);
	const [contentMaxHeight, setContentMaxHeight] = useState<number>(0);
	const closingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const contentContainerRef = useRef<HTMLDivElement>(null);
	const observationContainerRef = useRef<HTMLDivElement>(null);

	const arrowRotationDegree = isOpen
		? "180deg"
		: floatingReverseButton
			? "270deg"
			: "90deg";
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

	function handleOpenButton() {
		setMemoryOpenState(!isOpen, pathname, memoryName);
		if (isOpen) closeContent();
		else openContent();
	}

	const colorStyle = StandartColorKeysToProperties(textColor, backgroundColor);
	const containerStyle: CSSProperties = {
		...colorStyle,
		...(withoutPadding && { padding: 0 }),
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

	const TitleElement =
		typeof title === "string" ? (
			<UIBasics.Text textColor={titleColor}>{title}</UIBasics.Text>
		) : (
			title
		);

	return (
		<ToggleContainer
			style={containerStyle}
			className={
				floatingReverseButton ? styles.floatingReverseButton : undefined
			}
			id={id}>
			<HeaderContainer>
				{floatingReverseButton && TitleElement}
				<button
					style={{ ...colorStyle, ...buttonStyle }}
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
					{!floatingReverseButton && TitleElement}
				</button>
			</HeaderContainer>
			<ContentContainer
				className={defaultOpenState == true ? styles.isOpen : undefined}
				id={`UIBasics-toggle-${memoryId ?? "content"}`}
				ref={contentContainerRef}
				style={contentStyle}>
				<ResizeObservationContainer ref={observationContainerRef}>
					<LazyLoadWrapper children={children} />
				</ResizeObservationContainer>
			</ContentContainer>
		</ToggleContainer>
	);
}
