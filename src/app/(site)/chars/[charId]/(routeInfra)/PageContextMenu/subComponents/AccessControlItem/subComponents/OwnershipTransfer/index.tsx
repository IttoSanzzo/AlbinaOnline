import { AccessLevel, FullUser, Guid } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import Image from "next/image";
import { NotionHeader, NotionText } from "@/components/(NotionBased)";
import { TransferCharacter } from "./subComponents/TransferCharacter";

const OwnershipTransferContainer = newStyledElement.div(
	styles.ownershipTransferContainer
);
const OwnershipTransferUser = newStyledElement.div(
	styles.ownershipTransferUser
);

interface OwnershipTransferProps {
	ownerId: Guid;
	characterId: Guid;
	characterName: string;
	hasOwnerAccessLevel: boolean;
}
export function OwnershipTransfer({
	characterId,
	ownerId,
	characterName,
	hasOwnerAccessLevel,
}: OwnershipTransferProps) {
	const [userState, setUserState] = useState<FullUser | null>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/users/id/${ownerId}`), {
			method: "GET",
		}).then(async (response) => {
			if (!response.ok) return;
			const data = await response.json();
			setUserState(data.user);
		});
	}, []);
	if (userState == null) return null;

	return (
		<OwnershipTransferContainer>
			<OwnershipTransferUser>
				<Image
					src={userState.iconUrl}
					alt="0"
					width={60}
					height={60}
				/>
				<NotionHeader headerType="h3">{userState.nickname}</NotionHeader>
			</OwnershipTransferUser>
			<TransferCharacter
				characterId={characterId}
				characterName={characterName}
				disabled={!hasOwnerAccessLevel}
			/>
		</OwnershipTransferContainer>
	);
}
