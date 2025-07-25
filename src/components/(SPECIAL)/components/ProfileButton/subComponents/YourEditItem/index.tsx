"use client";

import { DropdownMenu } from "@/libs/stp@radix";
import Link from "next/link";

interface YourEditProps {
	userUsername: string;
}
export function YourEditItem({ userUsername }: YourEditProps) {
	return (
		<div>
			<Link href={`/users/${userUsername}/configuracoes`}>
				<DropdownMenu.Item
					iconProps={{
						name: "AddressBookTabs",
						color: "green",
						style: "bold",
					}}>
					Editar Perfil
				</DropdownMenu.Item>
			</Link>
		</div>
	);
}
