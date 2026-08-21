"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "@/libs/stp@radix";
import { ExitCampaignButton } from "../ExitCampaignButton";
import Link from "next/link";

export function PageContextMenu({ campaignSlug }: { campaignSlug: string }) {
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

					<Link
						style={{ color: "var(--cl-mauve-400)" }}
						href={`/campanhas/${campaignSlug}/ajustes`}
						prefetch={false}>
						<DropdownMenu.Item
							iconProps={{ name: "Gear", color: "purple", style: "bold" }}>
							Ajustes
						</DropdownMenu.Item>
					</Link>
					<DropdownMenu.Separator />
					<ExitCampaignButton />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
