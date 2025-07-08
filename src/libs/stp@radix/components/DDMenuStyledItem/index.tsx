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

interface DDMenuStyledItemProps extends DropdownMenu.DropdownMenuItemProps {
	iconProps: StpIconProps;
	rightHand?: ReactNode;
}

export function DDMenuStyledItem({
	iconProps,
	children,
	rightHand,
	className,
	...rest
}: DDMenuStyledItemProps) {
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
