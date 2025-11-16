"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HookedForm, SelectOption } from "@/libs/stp@forms";
import { RaceData } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

const schema = z.object({
	name: z.string().min(1, "Insira um nome!"),
	raceId: z.string().min(1, "Insira uma raça!"),
});

type FormData = z.infer<typeof schema>;

export function CreateCharForm() {
	const [responseMessage, setResponseMessage] = useState<string>("");
	const [raceOptions, setRaceOptions] = useState<SelectOption[]>([]);
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		fetch(`${getAlbinaApiFullAddress()}/races`, {
			cache: "force-cache",
		})
			.then((response) => response.json())
			.then((data: RaceData[]) =>
				setRaceOptions(
					data
						.map((race) => ({
							name: race.name,
							value: race.id,
							icon: race.iconUrl,
						}))
						.sort((a, b) => a.name.localeCompare(b.name))
				)
			)
			.catch((error) => console.error("Error fetching races", error));
	}, []);
	if (raceOptions.length == 0) return null;

	async function onSubmit(formData: FormData) {
		const response = await authenticatedFetchAsync(
			`${getAlbinaApiFullAddress()}/characters`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			}
		);
		if (response.status != 200) {
			setResponseMessage("A criação falhou");
			return;
		}
		const responseData = await response.json();
		router.push(`/chars/${responseData.character.id}`);
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput
				label="Nome"
				fieldName="name"
				fontSize="lg"
				textCentered
			/>
			<HookedForm.Select
				fieldName="raceId"
				label="Raça"
				placeholder="Selecione uma raça"
				options={raceOptions}
			/>
			<HookedForm.Space height={3} />

			<HookedForm.SubmitButton
				label="Criar"
				color="green"
			/>
			<HookedForm.SimpleMessage
				message={responseMessage}
				color="red"
			/>
		</HookedForm.Form>
	);
}
