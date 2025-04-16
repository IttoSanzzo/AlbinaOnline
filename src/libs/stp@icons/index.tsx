import React, { JSX } from "react";
import * as Phosphor from "@phosphor-icons/react/dist/ssr";
import { IconProps, IconWeight } from "@phosphor-icons/react";

enum IconColor {
	"default" = "#DFDFDF",
	"gray" = "#37352F",
	"brown" = "#9F6B53",
	"orange" = "#D9730D",
	"yellow" = "#CB912F",
	"green" = "#448361",
	"blue" = "#337EA9",
	"purple" = "#9065B0",
	"pink" = "#C14C8A",
	"red" = "#D44C47",
}

type PhosphorKey = keyof typeof Phosphor;

export interface StpIconProps {
	name: PhosphorKey | "";
	color?: keyof typeof IconColor;
	style?: IconWeight;
}

export type StpIcon = JSX.Element;
export function StpIcon({
	name,
	color = "default",
	style = "duotone",
}: StpIconProps): StpIcon {
	const PhosphorIcon = Phosphor[
		name !== "" ? name : "Note"
	] as React.FC<IconProps>;

	return (
		<PhosphorIcon
			color={IconColor[color]}
			weight={style}
		/>
	);
}
