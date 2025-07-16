"use client";

import { DropdownMenu } from "@/libs/stp@radix";
import Link from "next/link";

interface YourProfileProps {
	userUsername: string;
}
export function YourProfileItem({ userUsername }: YourProfileProps) {
	return (
		<div>
			<Link href={`/users/${userUsername}`}>
				<DropdownMenu.Item
					iconProps={{ name: "UserCircle", color: "blue", style: "bold" }}>
					Seu perfil
				</DropdownMenu.Item>
			</Link>
		</div>
	);
}
