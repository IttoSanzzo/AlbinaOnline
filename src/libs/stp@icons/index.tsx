import React, { JSX } from "react";
import * as Phosphor from "@phosphor-icons/react/dist/ssr";
import { IconProps, IconWeight } from "@phosphor-icons/react";
import { StandartTextColor } from "@/components/(UIBasics)";

export { StandartTextColor as StpIconColor };

export type PhosphorKey = keyof typeof Phosphor;

export interface StpIconProps {
	name: PhosphorKey | "";
	color?: keyof typeof StandartTextColor;
	style?: IconWeight;
	mirror?: boolean;
}

export type StpIcon = JSX.Element;

export function StpIcon({
	name,
	color = "default",
	style = "duotone",
	mirror = false,
}: StpIconProps): StpIcon {
	const PhosphorIcon = Phosphor[
		name !== "" ? name : "Note"
	] as React.FC<IconProps>;

	return (
		<PhosphorIcon
			color={StandartTextColor[color]}
			weight={style}
			style={mirror ? { transform: "scaleX(-1)" } : undefined}
		/>
	);
}
