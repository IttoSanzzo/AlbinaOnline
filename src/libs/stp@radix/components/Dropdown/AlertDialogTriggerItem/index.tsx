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
} from "../Item";
import externalStyles from "../Item/styles.module.css";
import styles from "./styles.module.css";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface AlertDialogTriggerItemProps
	extends DropdownMenu.DropdownMenuItemProps {
	iconProps: StpIconProps;
	rightHand?: ReactNode;
}

export function AlertDialogTriggerItem({
	iconProps,
	children,
	rightHand,
	className,
	...rest
}: AlertDialogTriggerItemProps) {
	return (
		<DropdownMenu.Item
			className={clsx(externalStyles.dropdownItem, className)}
			onSelect={(event) => {
				event.preventDefault();
			}}
			{...rest}
			asChild>
			<AlertDialog.Trigger className={styles.trigger}>
				<ItemPartsContainer>
					<ItemIcon children={StpIcon(iconProps)} />
					<ItemMainContainer>
						<ItemLeftHand children={children} />
						{rightHand && <ItemRightHand children={rightHand} />}
					</ItemMainContainer>
				</ItemPartsContainer>
			</AlertDialog.Trigger>
		</DropdownMenu.Item>
	);
}
