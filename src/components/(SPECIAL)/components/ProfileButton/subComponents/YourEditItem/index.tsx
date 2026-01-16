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
						name: "GearFine",
						color: "green",
						style: "bold",
					}}>
					Configurações
				</DropdownMenu.Item>
			</Link>
		</div>
	);
}
