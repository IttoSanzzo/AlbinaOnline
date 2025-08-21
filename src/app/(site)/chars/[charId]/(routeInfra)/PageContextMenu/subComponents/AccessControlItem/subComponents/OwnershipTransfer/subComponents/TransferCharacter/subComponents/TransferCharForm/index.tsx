"use client";

import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { AlertDialog } from "@/libs/stp@radix";
import { Guid } from "@/libs/stp@types";

const schema = z.object({
	newOwnerUserName: z.string(),
	charaterName: z.string(),
});

type FormData = z.infer<typeof schema>;

interface TransferCharFormProps {
	characterName: string;
	characterId: Guid;
}
export function TransferCharForm({
	characterName,
	characterId,
}: TransferCharFormProps) {
	const [responseMessage, setResponseMessage] = useState<string>("");
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(formData: FormData) {
		const body = {
			username: formData.newOwnerUserName,
		};
		const response = await authenticatedFetchAsync(
			`${getAlbinaApiAddress()}/characters/${characterId}/owner`,
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.status != 200) setResponseMessage("A transferência falhou");
		else window.location.reload();
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput
				fieldName="newOwnerUserName"
				label="Nome de usuário do novo dono"
				fontSize="lg"
				textCentered
				placeholder="Insira o nome de usuário do novo dono"
			/>
			<HookedForm.TextInput
				fieldName="charaterName"
				label="Nome do personagem"
				fontSize="lg"
				textCentered
				placeholder="Insira o nome do personagem"
			/>

			<HookedForm.Space height={3} />

			<AlertDialog.ButtonsContainer>
				<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
				<HookedForm.SubmitButton
					label="Transferir"
					color="blue"
					disabled={form.watch("charaterName") != characterName}>
					Transferir
				</HookedForm.SubmitButton>
			</AlertDialog.ButtonsContainer>
			<HookedForm.SimpleMessage
				message={responseMessage}
				color="red"
			/>
		</HookedForm.Form>
	);
}
