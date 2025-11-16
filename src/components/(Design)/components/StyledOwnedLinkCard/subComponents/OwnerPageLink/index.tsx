"use client";

import Image from "next/image";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";
import { Guid } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const OwnerPageLinkButton = newStyledElement.button(styles.ownerPageLinkButton);

export interface OwnerPageLinkProps {
	ownerId: Guid;
}
export default function OwnerPageLink({ ownerId }: OwnerPageLinkProps) {
	const router = useRouter();
	async function handleClick() {
		try {
			const response = await fetch(
				`${getAlbinaApiFullAddress()}/users/id/${ownerId}/username`,
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
				src={`${getAlbinaApiFullAddress()}/users/id/${ownerId}/favicon`}
				alt="Owner Avatar"
				width={30}
				height={30}
			/>
		</OwnerPageLinkButton>
	);
}
