import styles from "./VttTokenAppearenceRenderer.module.css";
import vttTokenElementStyles from "./VttTokenElement.module.css";
import {
	VttTokenAppearance,
	VttTokenType,
} from "../../../Types/Classes/VttToken";
import { newStyledElement } from "@setsu-tp/styled-components";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import clsx from "clsx";
import {
	VttTokenCreationTabEntryImageRenderer,
	VttTokenImageRenderer,
} from "./VttTokenImageRenderer";
import { Guid } from "@/libs/stp@types";

const VttTokenAppearenceRendererContainer = newStyledElement.div(
	styles.vttTokenAppearenceRendererContainer,
);
const ChipLayer = newStyledElement.div(styles.chipLayer);
const VttTokenOutline = newStyledElement.span(
	vttTokenElementStyles.vttTokenOutline,
);

interface VttTokenAppearenceRendererProps {
	vttTokenId?: Guid;
	targetId?: Guid;
	type?: keyof typeof VttTokenType;
	appearance: VttTokenAppearance;
	className?: string;
	pixelScale?: number;
	isDragging?: boolean;
	isActive?: boolean;
}
export function VttTokenAppearenceRenderer({
	vttTokenId,
	targetId,
	type,
	appearance,
	className,
	pixelScale,
	isDragging,
	isActive,
}: VttTokenAppearenceRendererProps) {
	return (
		<VttTokenAppearenceRendererContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			style={{
				rotate: `${appearance.rotation}deg`,
				pointerEvents: isActive ? "all" : undefined,
			}}>
			<ChipLayer
				className={clsx(className, styles[appearance.chipType])}
				style={{
					scale: `${appearance.horizontalMirror ? -1 : 1} ${appearance.verticalMirror ? -1 : 1}`,
					opacity: `${appearance.opacity / 100}`,
					overflow: appearance.hideImageOverflow ? "hidden" : "visible",
					borderWidth: pixelScale ? 3 * pixelScale : undefined,
				}}>
				{vttTokenId && (
					<VttTokenImageRenderer
						vttTokenId={vttTokenId}
						objectFit={appearance.imageFitMode}
					/>
				)}
				{!vttTokenId && type && (
					<VttTokenCreationTabEntryImageRenderer
						type={type}
						targetId={targetId}
						objectFit={appearance.imageFitMode}
					/>
				)}
			</ChipLayer>
			<VttTokenOutline
				className={
					isDragging ? vttTokenElementStyles.isDraggingOutline : undefined
				}
			/>
		</VttTokenAppearenceRendererContainer>
	);
}
