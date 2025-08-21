"use client";

import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { AlertDialog } from "@/libs/stp@radix";
import { Guid } from "@/libs/stp@types";

const schema = z.object({
	name: z.string(),
});

type FormData = z.infer<typeof schema>;

interface DeleteCharFormProps {
	characterName: string;
	characterId: Guid;
}
export function DeleteCharForm({
	characterName,
	characterId,
}: DeleteCharFormProps) {
	const [responseMessage, setResponseMessage] = useState<string>("");
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit() {
		const response = await authenticatedFetchAsync(
			`${getAlbinaApiAddress()}/characters/${characterId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.status != 200) setResponseMessage("A exclusão falhou");
		else router.push(`/chars`);
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput
				fieldName="name"
				label="Nome do personagem"
				fontSize="lg"
				textCentered
				placeholder="Insira o nome do personagem"
			/>
			<HookedForm.Space height={3} />

			<AlertDialog.ButtonsContainer>
				<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
				<HookedForm.SubmitButton
					label="Excluir"
					color="red"
					disabled={form.watch("name") != characterName}>
					Excluir
				</HookedForm.SubmitButton>
			</AlertDialog.ButtonsContainer>
			<HookedForm.SimpleMessage
				message={responseMessage}
				color="red"
			/>
		</HookedForm.Form>
	);
}
