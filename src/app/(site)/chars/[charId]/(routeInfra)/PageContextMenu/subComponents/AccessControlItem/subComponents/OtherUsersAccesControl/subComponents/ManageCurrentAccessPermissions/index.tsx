import { AccessLevel, CharacterAccessPermission } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import { UserAccessControl } from "./subComponents/UserAccessControl";
import styles from "./styles.module.css";
import { useCurrentUser } from "@/libs/stp@hooks";

const ManageCurrentAccessPermissionsContainer = newStyledElement.div(
	styles.manageCurrentAccessPermissionsContainer
);

interface ManageCurrentAccessPermissionsProps {
	accessPermissionsState: CharacterAccessPermission[];
	setAccessPermissionsState: Dispatch<
		SetStateAction<CharacterAccessPermission[]>
	>;
}
export function ManageCurrentAccessPermissions({
	accessPermissionsState,
	setAccessPermissionsState,
}: ManageCurrentAccessPermissionsProps) {
	const { user, loading } = useCurrentUser();
	if (loading === true || user === null) return null;
	return (
		<ManageCurrentAccessPermissionsContainer>
			{accessPermissionsState.length > 0 &&
				accessPermissionsState
					.filter(
						(accessPermission) =>
							AccessLevel[accessPermission.accessLevel] != AccessLevel.Owner &&
							accessPermission.userId != user.id
					)
					.map((accessPermission) => (
						<UserAccessControl
							key={accessPermission.id}
							accessPermission={accessPermission}
							setAccessPermissionsState={setAccessPermissionsState}
						/>
					))}
		</ManageCurrentAccessPermissionsContainer>
	);
}
