"use client";

import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormContainer } from "./styledElements";
import { HookedForm, SelectWithIconOption } from "@/libs/stp@forms";
import { RaceData } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

const schema = z.object({
	name: z.string().min(1, "Insira um nome!"),
	raceId: z.string().min(1, "Insira uma raça!"),
});

type FormData = z.infer<typeof schema>;

export function CreateCharForm() {
	const [responseMessage, setResponseMessage] = useState<string>("");
	const [raceOptions, setRaceOptions] = useState<SelectWithIconOption[]>([]);
	const router = useRouter();
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		fetch(`${getAlbinaApiAddress()}/races`, {
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
			`${getAlbinaApiAddress()}/characters`,
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
		<FormContainer onSubmit={handleSubmit(onSubmit)}>
			<HookedForm.TextInput
				label="Nome"
				control={control}
				fieldName="name"
				fontSize="lg"
				textCentered
			/>
			<HookedForm.SelectWithIcon
				control={control}
				fieldName="raceId"
				label="Raça"
				placeholder="Selecione uma raça"
				options={raceOptions}
			/>
			<HookedForm.Space height={3} />

			<HookedForm.SubmitButton
				label="Criar"
				color="green"
				disabled={isSubmitting}
			/>
			<HookedForm.SimpleMessage
				message={responseMessage}
				color="red"
			/>
		</FormContainer>
	);
}
