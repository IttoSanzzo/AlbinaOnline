"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "@/libs/stp@radix";
import { DeleteCharMenuItem } from "./subComponents/DeleteCharMenuItem";
import { AccessControlItem } from "./subComponents/AccessControlItem";

export function PageContextMenu() {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button className="moduleTriggerButton">
					<HamburgerMenuIcon color="gray" />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					side="bottom"
					sideOffset={20}>
					<AccessControlItem />
					<DeleteCharMenuItem />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
