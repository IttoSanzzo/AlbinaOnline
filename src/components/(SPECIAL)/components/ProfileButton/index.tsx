"use client";

import Image from "next/image";
import {
	ProfileButtonContainer,
	ProfileMenuTriggerButton,
} from "./styledElements";
import { useCurrentUser } from "@/libs/stp@hooks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styles from "./styles.module.css";
import { LogoutButton } from "./subComponents/LogoutItem";
import { DDMenuStyledItem } from "@/libs/stp@radix";

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
						className={styles.dropdownContent}
						side="bottom"
						sideOffset={10}>
						<DropdownMenu.Arrow className={styles.dropdownArrow} />

						<DropdownMenu.Item className={styles.dropdownItem}>
							Banana
						</DropdownMenu.Item>

						<DropdownMenu.Separator className={styles.dropdownSeparator} />

						<DropdownMenu.Item className={styles.dropdownItem}>
							Abacaxiiiiiiiii
						</DropdownMenu.Item>
						<DropdownMenu.Item className={styles.dropdownItem}>
							Uva
						</DropdownMenu.Item>

						<DDMenuStyledItem
							iconProps={{ name: "Acorn", color: "blue", style: "bold" }}>
							Teste
						</DDMenuStyledItem>

						<DropdownMenu.Separator className={styles.dropdownSeparator} />
						<LogoutButton />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</ProfileButtonContainer>
	);
}
