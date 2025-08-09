import { CharacterAccessPermission, FullUser } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import Image from "next/image";
import Link from "next/link";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { UserAccessLevelController } from "./subComponents/UserAccessLevelController";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const UserAccessControlContainer = newStyledElement.div(
	styles.userAccessControlContainer
);
const UserAccessControlUser = newStyledElement.div(
	styles.userAccessControlUser
);
const RemoveUserAccess = newStyledElement.button(styles.removeUserAccess);
const ControllersContainer = newStyledElement.div(styles.controllersContainer);

async function handleRemoveUserAccess(
	accessPermission: CharacterAccessPermission,
	setAccessPermissionsState: Dispatch<
		SetStateAction<CharacterAccessPermission[]>
	>
) {
	const body = {
		userId: accessPermission.userId,
	};
	const response = await authenticatedFetchAsync(
		getAlbinaApiAddress(
			`/chars/${accessPermission.characterId}/access-permissions`
		),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) return;
	setAccessPermissionsState((state) => [
		...state.filter(
			(accessPermissionState) =>
				accessPermissionState.userId != accessPermission.userId
		),
	]);
}

interface UserAccessControlProps {
	accessPermission: CharacterAccessPermission;
	setAccessPermissionsState: Dispatch<
		SetStateAction<CharacterAccessPermission[]>
	>;
}
export function UserAccessControl({
	accessPermission,
	setAccessPermissionsState,
}: UserAccessControlProps) {
	const [user, setUser] = useState<FullUser | null>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/users/id/${accessPermission.userId}`), {
			method: "GET",
		}).then(async (response) => {
			if (!response.ok) return;
			const data = await response.json();
			setUser(data.user);
		});
	}, [accessPermission]);
	if (user === null) return null;

	return (
		<UserAccessControlContainer>
			<Link href={`/users/${user.username}`}>
				<UserAccessControlUser>
					<Image
						src={user.iconUrl}
						alt=""
						width={30}
						height={30}
					/>
					<p>{user.nickname}</p>
				</UserAccessControlUser>
			</Link>
			<ControllersContainer>
				<UserAccessLevelController
					accessPermission={accessPermission}
					setAccessPermissionsState={setAccessPermissionsState}
				/>
				<RemoveUserAccess
					onClick={async () =>
						handleRemoveUserAccess(accessPermission, setAccessPermissionsState)
					}>
					Remover Acesso
				</RemoveUserAccess>
			</ControllersContainer>
		</UserAccessControlContainer>
	);
}
