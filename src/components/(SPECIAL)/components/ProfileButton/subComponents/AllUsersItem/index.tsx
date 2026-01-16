"use client";

import { DropdownMenu } from "@/libs/stp@radix";
import Link from "next/link";

export function AllUsersItem() {
	return (
		<div>
			<Link href={`/users`}>
				<DropdownMenu.Item
					iconProps={{
						name: "AddressBookIcon",
						color: "orange",
						style: "bold",
					}}>
					Todos os usuários
				</DropdownMenu.Item>
			</Link>
		</div>
	);
}
