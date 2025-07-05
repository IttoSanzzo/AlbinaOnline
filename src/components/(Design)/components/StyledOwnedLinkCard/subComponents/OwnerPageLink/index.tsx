"use client";

import Image from "next/image";
import { OwnerPageLinkButton } from "./styledElements";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";

export interface OwnerPageLinkProps {
	ownerId: string;
}
export default function OwnerPageLink({ ownerId }: OwnerPageLinkProps) {
	const router = useRouter();
	async function handleClick() {
		console.log("Trying it");
		try {
			const response = await fetch(
				`${getAlbinaApiAddress()}/users/id/${ownerId}/username`,
				{
					cache: "force-cache",
				}
			);
			if (!response.ok) router.push("/not-found");
			const data = await response.json();
			router.push(`/users/${data.username}`);
		} catch (error) {
			console.error(`Error while fetching username: ${error}`);
		}
	}

	return (
		<OwnerPageLinkButton onClick={handleClick}>
			<Image
				src={`${getAlbinaApiAddress()}/users/id/${ownerId}/favicon`}
				alt="Owner Avatar"
				width={30}
				height={30}
			/>
		</OwnerPageLinkButton>
	);
}
