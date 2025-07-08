"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import {
	ItemIcon,
	ItemLeftHand,
	ItemMainContainer,
	ItemPartsContainer,
	ItemRightHand,
} from "./styledElements";

interface ItemProps extends DropdownMenu.DropdownMenuItemProps {
	iconProps: StpIconProps;
	rightHand?: ReactNode;
}

export function Item({
	iconProps,
	children,
	rightHand,
	className,
	...rest
}: ItemProps) {
	return (
		<DropdownMenu.Item
			className={clsx(styles.dropdownItem, className)}
			{...rest}>
			<ItemPartsContainer>
				<ItemIcon children={StpIcon(iconProps)} />
				<ItemMainContainer>
					<ItemLeftHand children={children} />
					{rightHand && <ItemRightHand children={rightHand} />}
				</ItemMainContainer>
			</ItemPartsContainer>
		</DropdownMenu.Item>
	);
}
