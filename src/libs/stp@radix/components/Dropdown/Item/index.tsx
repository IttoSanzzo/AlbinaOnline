"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
import clsx from "clsx";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const ItemPartsContainer = newStyledElement.div(
	styles.itemPartsContainer
);
export const ItemIcon = newStyledElement.div(styles.itemIcon);
export const ItemMainContainer = newStyledElement.div(styles.itemMainContainer);
export const ItemLeftHand = newStyledElement.div(styles.itemLeftHand);
export const ItemRightHand = newStyledElement.div(styles.itemRightHand);

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
