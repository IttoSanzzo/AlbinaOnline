import styles from "./VttTokenAppearenceRenderer.module.css";
import { VttToken } from "../../../Types/Classes/VttToken";
import { newStyledElement } from "@setsu-tp/styled-components";
import {
	setVttElementDataAttributes,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import clsx from "clsx";

const VttTokenAppearenceRendererContainer = newStyledElement.div(
	styles.vttTokenAppearenceRendererContainer,
);

interface VttTokenAppearenceRendererProps {
	vttToken: VttToken;
	className?: string;
}
export function VttTokenAppearenceRenderer({
	vttToken,
	className,
}: VttTokenAppearenceRendererProps) {
	return (
		<VttTokenAppearenceRendererContainer
			{...setVttElementDataAttributes(
				VttElementDataAttribute.EventPing,
				VttElementDataAttribute.EventZoom,
				VttElementDataAttribute.EventMiddleButtonPan,
			)}
			className={clsx(className, styles[vttToken.appearance.chipType])}
			style={{
				scale: `${vttToken.appearance.horizontalMirror ? -1 : 1} ${vttToken.appearance.verticalMirror ? -1 : 1}`,
				rotate: `${vttToken.appearance.rotation}deg`,
				opacity: `${vttToken.appearance.opacity / 100}`,
				overflow: vttToken.appearance.hideImageOverflow ? "hidden" : undefined,
			}}></VttTokenAppearenceRendererContainer>
	);
}
