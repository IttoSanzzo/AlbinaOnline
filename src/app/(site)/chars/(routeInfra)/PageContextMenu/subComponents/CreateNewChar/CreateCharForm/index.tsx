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

const schema = z.object({
	name: z.string().min(1, "Insira um nome!"),
	race: z.string().min(1, "Insira uma raça!"),
});

type FormData = z.infer<typeof schema>;

export function CreateCharForm() {
	const [raceOptions, setRaceOptions] = useState<SelectWithIconOption[]>([]);
	const router = useRouter();
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
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
							value: race.slug,
							icon: race.iconUrl,
						}))
						.sort((a, b) => a.name.localeCompare(b.name))
				)
			)
			.catch((error) => console.error("Error fetching races", error));
	}, []);
	if (raceOptions.length == 0) return null;
	console.log(raceOptions);

	async function onSubmit(data: FormData) {
		console.log(data);
	}

	return (
		<FormContainer onSubmit={handleSubmit(onSubmit)}>
			<HookedForm.TextInput
				label="Nome"
				field={register("name")}
				errorMessage={errors.name?.message}
				fontSize="lg"
				textCentered
			/>
			<HookedForm.SelectWithIcon
				control={control}
				fieldName="race"
				label="Raça"
				errorMessage={errors.race?.message}
				placeholder="Selecione uma raça"
				options={raceOptions}
			/>
			<HookedForm.Space height={3} />

			<HookedForm.SubmitButton
				label="Criar"
				color="green"
			/>
			<HookedForm.SimpleMessage color="red" />
		</FormContainer>
	);
}
