import styles from "./VttTokenPlacementPreview.module.css";
import { Guid } from "@/libs/stp@types";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";
import {
	DefaultVttTokenAppearance,
	VttTokenAppearance,
	VttTokenType,
} from "../../../../../Types/Classes/VttToken";
import { newStyledElement } from "@setsu-tp/styled-components";
import { VttTokenAppearenceRenderer } from "../../../../VttBoard/TokenBoardLayer/VttTokenAppearenceRenderer";
import { useVttThrottledViewportContext } from "../../../../../Contexts/VttThrottledViewportContext";
import { VTTTOKEN_RENDER_THROTTLE } from "../../../../VttBoard/TokenBoardLayer/VttTokenElementWrapper";
import { getVttTokenSnap } from "../../../../VttBoard/TokenBoardLayer/VttTokenElement.utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { WindowCursorState } from "../../../../../Contexts/WindowStates";
import { useVttInteractionContext } from "../../../../../Contexts/VttInteractionContextProvider";
import { createPortal } from "react-dom";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const VttTokenPlacementPreviewAnchor = newStyledElement.div(
	styles.vttTokenPlacementPreviewAnchor,
);
const VttTokenPlacementPreviewContainer = newStyledElement.div(
	styles.vttTokenPlacementPreviewContainer,
);

interface VttTokenPlacementPreviewBaseProps {
	onPlace: (coordinates: CoordinatePair) => void;
	onCancel: () => void;
	validatePlacement?: (
		finalCoordinates: CoordinatePair,
		pointerPosition: CoordinatePair,
	) => boolean;
}

type VttTokenPlacementPreviewProps = VttTokenPlacementPreviewBaseProps & {
	appearance: VttTokenAppearance;
	tokenId?: Guid;
	targetType?: keyof typeof VttTokenType;
	targetId?: Guid;
};

type VttTokenPlacementPreviewWrapperProps = Omit<
	VttTokenPlacementPreviewProps,
	"appearance"
> & {
	appearance?: VttTokenAppearance;
};

export function VttTokenPlacementPreviewWrapper({
	appearance,
	tokenId,
	targetType,
	targetId,
	...props
}: VttTokenPlacementPreviewWrapperProps) {
	const [finalAppearance, setFinalAppearence] =
		useState<VttTokenAppearance | null>(appearance ?? null);

	useLayoutEffect(() => {
		if (finalAppearance) return;
		function stoppedBeforeAppearence() {
			if (!finalAppearance) props.onCancel();
		}
		window.addEventListener("pointerup", stoppedBeforeAppearence);
		return () => {
			window.removeEventListener("pointerup", stoppedBeforeAppearence);
		};
	}, [finalAppearance]);

	useEffect(() => {
		(async () => {
			if (appearance) {
				if (finalAppearance) setFinalAppearence(null);
				return;
			}
			if (targetType == "None") {
				setFinalAppearence(DefaultVttTokenAppearance);
				return;
			}
			const response = await fetch(
				getAlbinaApiFullAddress(
					tokenId
						? `/tokens/${tokenId}/appearence`
						: `/tokens/default/${targetType}/${targetId}/appearence`,
				),
			);
			if (!response.ok) return;
			setFinalAppearence(await response.json());
		})();
	}, [appearance, setFinalAppearence, tokenId, targetType, targetId]);

	if (!appearance && !finalAppearance) return null;
	return (
		<VttTokenPlacementPreview
			{...props}
			appearance={finalAppearance ?? appearance!}
			tokenId={tokenId}
			targetType={targetType}
			targetId={targetId}
		/>
	);
}

export function VttTokenPlacementPreview({
	tokenId,
	targetType,
	targetId,
	appearance,
	onPlace,
	onCancel,
	validatePlacement,
}: VttTokenPlacementPreviewProps) {
	const anchorRef = useRef<HTMLDivElement>(null);

	const setEdgeScrollOverride = useVttInteractionContext(
		(state) => state.setEdgeScrollOverride,
	);
	const pixelScale = useVttThrottledViewportContext(
		(state) => state.pixelScale,
		VTTTOKEN_RENDER_THROTTLE,
	);
	const screenToWorld = useVttThrottledViewportContext(
		(state) => state.screenToWorld,
		500,
	);

	const width = appearance.width * (appearance.scale / 100) * pixelScale;
	const height = appearance.height * (appearance.scale / 100) * pixelScale;

	useEffect(() => {
		setEdgeScrollOverride(true);
		const snap = getVttTokenSnap(appearance);

		function handlePointerMove(event: PointerEvent) {
			const anchor = anchorRef.current;
			if (!anchor) return;
			anchor.style.left = `${event.clientX}px`;
			anchor.style.top = `${event.clientY}px`;
		}
		function handlePointerUp(event: PointerEvent) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			if (event.button === 2) {
				onCancel();
				return;
			}
			const pointerPosition = {
				x: event.clientX,
				y: event.clientY,
			};
			const coordinates = screenToWorld(pointerPosition);
			const finalCoordinates = {
				x: Math.round(coordinates.x),
				y: Math.round(coordinates.y),
			};

			if (
				validatePlacement &&
				!validatePlacement(finalCoordinates, pointerPosition)
			) {
				onCancel();
				return;
			}

			onPlace(snap(finalCoordinates));
		}
		function handleContextMenu(event: MouseEvent) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			onCancel();
		}
		function handlePointerCancel(event: PointerEvent) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
			onCancel();
		}

		window.addEventListener("pointermove", handlePointerMove);
		window.addEventListener("pointerup", handlePointerUp, true);
		window.addEventListener("contextmenu", handleContextMenu, true);
		window.addEventListener("pointercancel", handlePointerCancel, true);

		return () => {
			setEdgeScrollOverride(null);
			window.removeEventListener("pointermove", handlePointerMove);
			window.removeEventListener("pointerup", handlePointerUp, true);
			window.removeEventListener("contextmenu", handleContextMenu, true);
			window.removeEventListener("pointercancel", handlePointerCancel, true);
		};
	}, [appearance, screenToWorld, onPlace, onCancel]);

	return createPortal(
		<VttTokenPlacementPreviewAnchor
			id="VttTokenPlacementPreview"
			ref={anchorRef}
			style={{
				left: `${WindowCursorState.x}px`,
				top: `${WindowCursorState.y}px`,
			}}>
			<VttTokenPlacementPreviewContainer style={{ width, height }}>
				<VttTokenAppearenceRenderer
					vttTokenId={tokenId}
					targetId={targetId}
					type={targetType}
					appearance={appearance}
					pixelScale={pixelScale}
					isDragging={true}
					isActive={true}
				/>
			</VttTokenPlacementPreviewContainer>
		</VttTokenPlacementPreviewAnchor>,
		document.body,
	);
}
