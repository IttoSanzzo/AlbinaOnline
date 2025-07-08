"use client";

import Image from "next/image";
import {
	ProfileButtonContainer,
	ProfileMenuTriggerButton,
} from "./styledElements";
import { useCurrentUser } from "@/libs/stp@hooks";
import { LogoutButton } from "./subComponents/LogoutItem";
import { DropdownMenu } from "@/libs/stp@radix";

export function ProfileButton() {
	const { user } = useCurrentUser();

	if (!user) return <ProfileButtonContainer />;
	return (
		<ProfileButtonContainer>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<ProfileMenuTriggerButton>
						<Image
							src={user.iconUrl}
							alt="Profile image"
							width={32}
							height={32}
							priority
						/>
					</ProfileMenuTriggerButton>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						side="bottom"
						sideOffset={10}>
						<DropdownMenu.Arrow />

						<LogoutButton />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</ProfileButtonContainer>
	);
}
