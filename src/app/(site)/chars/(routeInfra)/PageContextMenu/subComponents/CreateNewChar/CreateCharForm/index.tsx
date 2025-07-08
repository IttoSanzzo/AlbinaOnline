"use client";

import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FormContainer } from "./styledElements";
import { Select } from "@/libs/stp@radix";
import {
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

type RaceOption = {
	name: string;
	slug: string;
	iconUrl: string;
};

const schema = z.object({
	name: z.string().min(1, "Insira um nome!"),
	race: z.string().min(1, "Insira uma raça!"),
});

type FormData = z.infer<typeof schema>;

export function CreateCharForm() {
	const [raceOptions, setRaceOptions] = useState<RaceOption[]>([]);
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
			.then((data: RaceOption[]) =>
				setRaceOptions(data.sort((a, b) => a.name.localeCompare(b.name)))
			)
			.catch((error) => console.error("Error fetching races", error));
	}, []);

	if (raceOptions.length == 0) return null;

	async function onSubmit(data: FormData) {
		console.log(data);
	}

	return (
		<FormContainer onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label>name</label>
				<input
					{...register("name")}
					placeholder="Nome"
				/>
			</div>
			<div>
				<label>Raça</label>
				<Controller
					control={control}
					name="race"
					render={({ field }) => (
						<Select.Root
							onValueChange={field.onChange}
							value={field.value}>
							<Select.Trigger>
								<Select.Value placeholder="Selecione uma raça" />
								<Select.Icon>
									<ChevronDownIcon />
								</Select.Icon>
							</Select.Trigger>

							<Select.Portal>
								<Select.Content>
									<Select.ScrollUpButton>
										<ChevronUpIcon />
									</Select.ScrollUpButton>

									<Select.Viewport>
										{raceOptions.map((race) => (
											<Select.Item
												key={race.slug}
												value={race.slug}>
												{race.iconUrl && (
													<Image
														src={race.iconUrl}
														alt=""
														width={12}
														height={12}
													/>
												)}
												<Select.ItemText>{race.name}</Select.ItemText>
												<Select.ItemIndicator>
													<CheckIcon />
												</Select.ItemIndicator>
											</Select.Item>
										))}
									</Select.Viewport>

									<Select.ScrollDownButton>
										<ChevronDownIcon />
									</Select.ScrollDownButton>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					)}
				/>
			</div>
		</FormContainer>
	);
}
