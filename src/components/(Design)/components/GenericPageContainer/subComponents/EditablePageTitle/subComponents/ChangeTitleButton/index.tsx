"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import { DialogDescription } from "@radix-ui/react-dialog";
import { HookedForm } from "@/libs/stp@forms";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { PageTitle } from "../../../PageHeader";
import { revalidateMetadata } from "@/utils/ServerActions";
import toast from "react-hot-toast";

const ChangeTitleButtonContainer = newStyledElement.div(
	styles.changeTitleButtonContainer
);
const ChangeTitleButtonTrigger = newStyledElement.button(
	styles.changeTitleButtonTrigger
);

const schema = z.object({
	newName: z.string().min(1, "Mínimo de 1 caractere"),
});
type FormData = z.infer<typeof schema>;

interface ChangeTitleButtonProps {
	setTitle: Dispatch<SetStateAction<string>>;
	title: string;
	route: string;
	titleChangeBodyPropName?: string;
	metadataTag?: string;
}
export function ChangeTitleButton({
	setTitle,
	title,
	route,
	titleChangeBodyPropName,
	metadataTag,
}: ChangeTitleButtonProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			newName: title,
		},
	});

	async function onSubmit(data: FormData) {
		const toastId = toast.loading("Salvando...");
		const bodyPropName = titleChangeBodyPropName
			? titleChangeBodyPropName
			: "name";
		const body = {
			[bodyPropName]: data.newName,
		};

		const response = await authenticatedFetchAsync(route, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			toast.error("Salvamento falhou", { id: toastId });
			setError("Salvamento falhou");
			return;
		}
		toast.success("Salvo", { id: toastId });
		setOpen(false);
		setTitle(data.newName);
		if (metadataTag) revalidateMetadata(metadataTag);
	}

	return (
		<ChangeTitleButtonContainer>
			<PageTitle>{title}</PageTitle>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<ChangeTitleButtonTrigger />
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content>
							<Dialog.Title textAlign="center">Novo Nome</Dialog.Title>
							<DialogDescription />
							<HookedForm.Form
								form={form}
								onSubmit={onSubmit}>
								<HookedForm.TextInput
									fieldName="newName"
									label="Insira o nome"
								/>
								<HookedForm.SubmitButton label="Salvar" />
								{error && (
									<HookedForm.SimpleMessage
										color="red"
										message={error}
									/>
								)}
							</HookedForm.Form>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</ChangeTitleButtonContainer>
	);
}
