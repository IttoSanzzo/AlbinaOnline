import { AccessLevel, CharacterAccessPermission, Guid } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import { Dispatch, SetStateAction, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

const AddNewUserAccessPermissionContainer = newStyledElement.div(
	styles.addNewUserAccessPermissionContainer
);
const AddNewUserAccessPermissionButton = newStyledElement.button(
	styles.addNewUserAccessPermissionButton
);

const schema = z.object({
	username: z.string().min(1, "Nome de usuário dev ser preenchido"),
});
type FormData = z.infer<typeof schema>;

interface AddNewUserAccessPermissionProps {
	characterId: Guid;
	setAccessPermissionsState: Dispatch<
		SetStateAction<CharacterAccessPermission[] | null>
	>;
}
export function AddNewUserAccessPermission({
	characterId,
	setAccessPermissionsState,
}: AddNewUserAccessPermissionProps) {
	const [error, setError] = useState<string>("");
	const [open, setOpen] = useState<boolean>(false);
	const {
		handleSubmit,
		control,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: "",
		},
	});

	async function addUserToPermissions(formData: FormData) {
		const body = {
			username: formData.username,
			accessLevel: AccessLevel.ViewOnly,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/access-permissions`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			setError("Falha ao adicionar permissão");
			return;
		}
		const data: CharacterAccessPermission = await response.json();
		setAccessPermissionsState((state) => {
			if (state == null) return null;
			return [...state, data];
		});
		setOpen(false);
	}

	return (
		<AddNewUserAccessPermissionContainer>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<AddNewUserAccessPermissionButton>
						Nova Permissão
					</AddNewUserAccessPermissionButton>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay />
					<Dialog.Content>
						<Dialog.Title style={{ marginBottom: 20 }}>
							Permitir novo usuário
						</Dialog.Title>
						<Dialog.Description>
							Permite que um novo usuário possa ver o personagem.
						</Dialog.Description>
						<HookedForm.Form onSubmit={handleSubmit(addUserToPermissions)}>
							<HookedForm.Space />
							<HookedForm.TextInput
								control={control}
								fieldName="username"
								label="Nome de Usuário"
								placeholder="Nome de usuário a ser adicionado"
							/>
							<HookedForm.SubmitButton
								label="Adicionar"
								disabled={!isValid}
							/>
							<HookedForm.SimpleMessage
								color="red"
								message={error}
							/>
						</HookedForm.Form>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</AddNewUserAccessPermissionContainer>
	);
}
