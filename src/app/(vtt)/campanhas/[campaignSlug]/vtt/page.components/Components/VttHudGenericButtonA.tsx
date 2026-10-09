import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttHudGenericButtonA.module.css";
import { setVttElementHoverInteraction } from "../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../Types/Classes/VttMouseState";
import { PhosphorKey, StpIcon, StpIconColor } from "@/libs/stp@icons";
import { IconWeight } from "@phosphor-icons/react";
import clsx from "clsx";

const VttHudGenericButton = newStyledElement.button(styles.vttHudGenericButton);
const IconContainer = newStyledElement.div(styles.iconContainer);

interface VttHudGenericButtonAProps extends React.ComponentPropsWithoutRef<"button"> {
	stpIconName?: PhosphorKey | "";
	stpIconColor?: keyof typeof StpIconColor;
	stpIconStyle?: IconWeight;
	stpIconMirror?: boolean;
	isActive?: boolean;
}
export function VttHudGenericButtonA({
	stpIconName,
	stpIconColor,
	stpIconMirror,
	stpIconStyle,
	isActive = false,
	className,
	...rest
}: VttHudGenericButtonAProps) {
	return (
		<VttHudGenericButton
			className={clsx(className, isActive ? styles.isActive : undefined)}
			{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
			{...rest}>
			<IconContainer>
				{stpIconName && (
					<StpIcon
						name={stpIconName}
						style={stpIconStyle ?? "fill"}
						color={stpIconColor ?? "gray"}
						mirror={stpIconMirror}
					/>
				)}
			</IconContainer>
		</VttHudGenericButton>
	);
}
