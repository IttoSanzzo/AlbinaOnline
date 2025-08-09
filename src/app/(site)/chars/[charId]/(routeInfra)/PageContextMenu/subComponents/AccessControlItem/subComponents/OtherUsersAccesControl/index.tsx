import { CharacterAccessPermission, Guid } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { AddNewUserAccessPermission } from "./subComponents/AddNewUserAccessPermission";
import { ManageCurrentAccessPermissions } from "./subComponents/ManageCurrentAccessPermissions";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const OtherUsersAccessControlContainer = newStyledElement.div(
	styles.otherUsersAccessControlContainer
);

interface OtherUsersAccessControlProps {
	characterId: Guid;
}
export function OtherUsersAccessControl({
	characterId,
}: OtherUsersAccessControlProps) {
	const [accessPermissionsState, setAccessPermissionsState] = useState<
		CharacterAccessPermission[] | null
	>(null);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress(`/chars/${characterId}/access-permissions`), {
			method: "GET",
		}).then(async (response) => {
			if (!response.ok) return;
			const data = await response.json();
			setAccessPermissionsState(data);
		});
	}, []);
	if (accessPermissionsState == null) return null;

	return (
		<OtherUsersAccessControlContainer>
			<AddNewUserAccessPermission
				characterId={characterId}
				setAccessPermissionsState={setAccessPermissionsState}
			/>
			<ManageCurrentAccessPermissions
				accessPermissionsState={accessPermissionsState}
				setAccessPermissionsState={
					setAccessPermissionsState as Dispatch<
						SetStateAction<CharacterAccessPermission[]>
					>
				}
			/>
		</OtherUsersAccessControlContainer>
	);
}
