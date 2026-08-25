"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "@/libs/stp@radix";
import { ExitCampaignButton } from "../ExitCampaignButton";

export function NotMasterPageContextMenu() {
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

					<ExitCampaignButton />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
