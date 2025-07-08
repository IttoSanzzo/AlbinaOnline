"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { CreateNewChar } from "./subComponents/CreateNewChar";
import { DropdownMenu } from "@/libs/stp@radix";

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
					<DropdownMenu.Arrow />

					<CreateNewChar />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
