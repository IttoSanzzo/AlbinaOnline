import styles from "./OffScreenCursor.module.css";
import { CampaignMember } from "@/libs/stp@types";
import { VttMouseState } from "../../Types/VttMouseState";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useVttViewportContext } from "../../Contexts/VttViewportContextProvider";
import { useRef } from "react";

const OffScreenCursorContainer = newStyledElement.div(
	styles.offScreenCursorContainer,
);
const CursorArrowContainer = newStyledElement.div(styles.cursorArrowContainer);
const CursorInfo = newStyledElement.div(styles.cursorInfo);
const CursorUserName = newStyledElement.div(styles.cursorUserName);
const CursorDistance = newStyledElement.div(styles.cursorDistance);

const EDGE_PADDING = 22;
const INFO_GAP = 12;
const INFO_HEIGHT = 44;

interface OffScreenCursorProps {
	member?: CampaignMember;
	mouseState: VttMouseState;
	screenPosition: {
		x: number;
		y: number;
	};
	angle: number;
	distance: number;
	onClick: () => void;
}
function formatDistance(distance: number) {
	const centimeters = Math.round(distance);
	if (centimeters < 100) return `${centimeters} cm`;

	const kilometers = Math.floor(centimeters / 100000);
	const remainingAfterKilometers = centimeters % 100000;

	const meters = Math.floor(remainingAfterKilometers / 100);
	const remainingCentimeters = remainingAfterKilometers % 100;

	const parts: string[] = [];
	if (kilometers > 0) parts.push(`${kilometers} km`);
	if (meters > 0) parts.push(`${meters} m`);
	if (remainingCentimeters > 0) parts.push(`${remainingCentimeters} cm`);

	return parts.join(" ");
}

export function OffScreenCursor({
	member,
	mouseState,
	screenPosition,
	onClick,
}: OffScreenCursorProps) {
	const { viewport, pixelsPerCentimeter, camera } = useVttViewportContext();

	const previousAngle = useRef<number | null>(null);
	const centerX = viewport.width / 2;
	const centerY = viewport.height / 2;
	const directionX = screenPosition.x - centerX;
	const directionY = screenPosition.y - centerY;
	const rawAngle = Math.atan2(directionY, directionX);

	let angle = rawAngle;
	if (previousAngle.current !== null) {
		while (angle - previousAngle.current > Math.PI) angle -= Math.PI * 2;
		while (angle - previousAngle.current < -Math.PI) angle += Math.PI * 2;
	}
	previousAngle.current = angle;

	const halfWidth = viewport.width / 2 - EDGE_PADDING;
	const halfHeight = viewport.height / 2 - EDGE_PADDING;
	const scaleX = directionX === 0 ? Infinity : halfWidth / Math.abs(directionX);
	const scaleY =
		directionY === 0 ? Infinity : halfHeight / Math.abs(directionY);
	const scale = Math.min(scaleX, scaleY);
	const arrowX = centerX + directionX * scale;
	const arrowY = centerY + directionY * scale;
	const hitHorizontalEdge = scaleX < scaleY;
	const hitVerticalEdge = scaleY < scaleX;

	const closestScreenX = Math.max(
		0,
		Math.min(viewport.width, screenPosition.x),
	);
	const closestScreenY = Math.max(
		0,
		Math.min(viewport.height, screenPosition.y),
	);

	const screenDistanceX = screenPosition.x - closestScreenX;
	const screenDistanceY = screenPosition.y - closestScreenY;
	const screenDistance = Math.sqrt(
		screenDistanceX * screenDistanceX + screenDistanceY * screenDistanceY,
	);
	const distance = screenDistance / (pixelsPerCentimeter * camera.zoom);
	let infoTransform: string;
	if (hitHorizontalEdge) {
		if (directionX < 0) {
			// Left
			infoTransform = `translate(${INFO_GAP}px, -50%)`;
		} else {
			// Right
			infoTransform = `translate(calc(-100% - ${INFO_GAP}px), -50%)`;
		}
	} else if (hitVerticalEdge) {
		if (directionY < 0) {
			// Top
			infoTransform = `translate(-50%, ${INFO_GAP}px)`;
		} else {
			// Bottom
			infoTransform = `translate(-50%, calc(-100% - ${INFO_GAP}px))`;
		}
	} else {
		// Exact corner / extremely rare case.
		infoTransform = "translate(-50%, -50%)";
	}

	let infoTop = arrowY;
	if (hitVerticalEdge) {
		if (directionY < 0) {
			// Top
			infoTop = Math.max(
				EDGE_PADDING,
				Math.min(
					viewport.height - INFO_HEIGHT - EDGE_PADDING,
					arrowY + INFO_GAP,
				),
			);
		} else {
			// Bottom
			infoTop = Math.max(
				EDGE_PADDING + INFO_HEIGHT,
				Math.min(viewport.height - EDGE_PADDING, arrowY - INFO_GAP),
			);
		}
	} else {
		infoTop = Math.max(
			EDGE_PADDING + INFO_HEIGHT / 2,
			Math.min(viewport.height - EDGE_PADDING - INFO_HEIGHT / 2, arrowY),
		);
	}

	return (
		<OffScreenCursorContainer>
			<CursorArrowContainer
				style={{
					left: arrowX,
					top: arrowY,
					transform: `rotate(${angle + Math.PI / 2}rad)`,
				}}
				onClick={onClick}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style={{
						color: mouseState.color1,
					}}>
					<path
						d="M20 14C20 18.4183 16.4183 22 12 22C7.58172 22 4 18.4183 4 14C4 12.9391 4.20651 11.9264 4.58152 11C5.76829 8.06817 12 2 12 2C12 2 18.2317 8.06817 19.4185 11C19.7935 11.9264 20 12.9391 20 14Z"
						fill={mouseState.color2}
						stroke={mouseState.color1}
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</CursorArrowContainer>

			<CursorInfo
				style={{
					left: arrowX,
					top: infoTop,
					transform: infoTransform,
				}}>
				<CursorUserName
					style={{
						color: mouseState.color1,
					}}>
					{member?.user.nickname ?? ""}
				</CursorUserName>

				<CursorDistance>{formatDistance(distance)}</CursorDistance>
			</CursorInfo>
		</OffScreenCursorContainer>
	);
}
