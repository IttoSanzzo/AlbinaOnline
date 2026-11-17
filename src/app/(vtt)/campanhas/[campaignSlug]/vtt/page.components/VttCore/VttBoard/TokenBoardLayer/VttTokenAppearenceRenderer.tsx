import styles from "./VttTokenAppearenceRenderer.module.css";
import vttTokenElementStyles from "./VttTokenElement.module.css";
import { VttToken } from "../../../Types/Classes/VttToken";
import { newStyledElement } from "@setsu-tp/styled-components";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import clsx from "clsx";
import { VttTokenImageRenderer } from "./VttTokenImageRenderer";

const VttTokenAppearenceRendererContainer = newStyledElement.div(
	styles.vttTokenAppearenceRendererContainer,
);
const ChipLayer = newStyledElement.div(styles.chipLayer);
const VttTokenOutline = newStyledElement.span(
	vttTokenElementStyles.vttTokenOutline,
);

interface VttTokenAppearenceRendererProps {
	vttToken: VttToken;
	className?: string;
	pixelScale?: number;
	isDragging?: boolean;
	isActive?: boolean;
}
export function VttTokenAppearenceRenderer({
	vttToken,
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
				rotate: `${vttToken.appearance.rotation}deg`,
				pointerEvents: isActive ? "all" : undefined,
			}}>
			<ChipLayer
				className={clsx(className, styles[vttToken.appearance.chipType])}
				style={{
					scale: `${vttToken.appearance.horizontalMirror ? -1 : 1} ${vttToken.appearance.verticalMirror ? -1 : 1}`,
					opacity: `${vttToken.appearance.opacity / 100}`,
					overflow: vttToken.appearance.hideImageOverflow
						? "hidden"
						: "visible",
					borderWidth: pixelScale ? 3 * pixelScale : undefined,
				}}>
				<VttTokenImageRenderer
					vttTokenId={vttToken.id}
					objectFit={vttToken.appearance.imageFitMode}
				/>
			</ChipLayer>
			<VttTokenOutline
				className={
					isDragging ? vttTokenElementStyles.isDraggingOutline : undefined
				}
			/>
		</VttTokenAppearenceRendererContainer>
	);
}
