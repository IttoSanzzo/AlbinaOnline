import { AccessLevel, CharacterAccessPermission } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import {
	useCurrentCharacterAccessLevel,
	useCurrentPageData,
} from "@/libs/stp@hooks";

const UserAccessLevelControllerContainer = newStyledElement.div(
	styles.userAccessLevelControllerContainer
);

const schema = z.object({
	accessLevel: z.string(),
});
type FormData = z.infer<typeof schema>;

interface UserAccessLevelControllerProps {
	accessPermission: CharacterAccessPermission;
	setAccessPermissionsState: Dispatch<
		SetStateAction<CharacterAccessPermission[]>
	>;
}
export function UserAccessLevelController({
	accessPermission,
	setAccessPermissionsState,
}: UserAccessLevelControllerProps) {
	const currentCharacterAccessLevel = useCurrentCharacterAccessLevel();
	const {
		control,
		formState: { isValid },
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			accessLevel: accessPermission.accessLevel,
		},
	});

	if (currentCharacterAccessLevel.accessLevel < AccessLevel.CoOwner)
		return null;

	async function onFormChange(formData: FormData): Promise<boolean> {
		const body = {
			userId: accessPermission.userId,
			accessLevel: formData.accessLevel,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(
				`/chars/${accessPermission.characterId}/access-permissions`
			),
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) return false;
		setAccessPermissionsState((state) =>
			state.map((accessPermissionState) => ({
				...accessPermissionState,
				accessLevel:
					accessPermissionState.userId === accessPermission.userId
						? accessPermission.accessLevel
						: accessPermissionState.accessLevel,
			}))
		);
		return true;
	}

	const selectOptions =
		currentCharacterAccessLevel.accessLevel >= AccessLevel.Owner
			? [
					{
						name: "Apenas Ver",
						value: "ViewOnly",
					},
					{
						name: "Editar",
						value: "Edit",
					},
					{
						name: "Co-Dono",
						value: "CoOwner",
					},
			  ]
			: [
					{
						name: "Apenas Ver",
						value: "ViewOnly",
					},
					{
						name: "Editar",
						value: "Edit",
					},
			  ];

	return (
		<UserAccessLevelControllerContainer>
			<HookedForm.Form>
				<HookedForm.WatchedAction
					watch={watch}
					isValid={isValid}
					action={onFormChange}
				/>
				<HookedForm.SelectWithIcon
					control={control}
					fieldName="accessLevel"
					label="Nível de Acesso"
					width={"150px"}
					options={selectOptions}
				/>
			</HookedForm.Form>
		</UserAccessLevelControllerContainer>
	);
}
