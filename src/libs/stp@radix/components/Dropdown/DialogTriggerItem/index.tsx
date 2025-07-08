"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";
import clsx from "clsx";
import { StpIcon, StpIconProps } from "@/libs/stp@icons";
import {
	ItemIcon,
	ItemLeftHand,
	ItemMainContainer,
	ItemPartsContainer,
	ItemRightHand,
} from "../Item/styledElements";
import externalStyles from "../Item/styles.module.css";
import styles from "./styles.module.css";
import * as Dialog from "@radix-ui/react-dialog";

interface DialogTriggerItemProps extends DropdownMenu.DropdownMenuItemProps {
	iconProps: StpIconProps;
	rightHand?: ReactNode;
}

export function DialogTriggerItem({
	iconProps,
	children,
	rightHand,
	className,
	...rest
}: DialogTriggerItemProps) {
	return (
		<DropdownMenu.Item
			className={clsx(externalStyles.dropdownItem, className)}
			onSelect={(event) => {
				event.preventDefault();
			}}
			{...rest}
			asChild>
			<Dialog.Trigger className={styles.trigger}>
				<ItemPartsContainer>
					<ItemIcon children={StpIcon(iconProps)} />
					<ItemMainContainer>
						<ItemLeftHand children={children} />
						{rightHand && <ItemRightHand children={rightHand} />}
					</ItemMainContainer>
				</ItemPartsContainer>
			</Dialog.Trigger>
		</DropdownMenu.Item>
	);
}
