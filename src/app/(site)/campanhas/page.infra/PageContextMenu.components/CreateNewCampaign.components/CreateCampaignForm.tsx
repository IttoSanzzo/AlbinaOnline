"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	HookedForm,
	SelectOption,
	toSlug,
	zEnumKey,
	zSlug,
} from "@/libs/stp@forms";
import { CampaignSubType, CampaignType } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import toast from "react-hot-toast";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const schema = z.object({
	name: z.string().min(1, "Insira um nome!"),
	slug: zSlug(),
	type: zEnumKey(CampaignType),
	subType: zEnumKey(CampaignSubType),
	maxPlayers: z
		.number()
		.min(0, "Mínimo de 0 (Sem limite)")
		.max(20, "Limite máximo de 20"),
	isListed: z.boolean(),
	isOpen: z.boolean(),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const typeOptions: SelectOption[] = [
	{ name: "Sem Fim", value: "Indefinite" },
	{ name: "Longa", value: "Long" },
	{ name: "Curta", value: "Short" },
	{ name: "OneShot", value: "OneShot" },
];

export function CreateCampaignForm() {
	const router = useRouter();
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			name: "",
			type: undefined,
			subType: "Unknown",
			maxPlayers: 0,
			isListed: true,
			isOpen: true,
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Criando...");

		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/campaigns`),
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			},
		);
		if (!response.ok) {
			toast.error("A criação falhou", { id: toastId });
			return;
		}
		toast.success("Criado", { id: toastId });
		await revalidateTagByClientSide("/campaigns");
		router.push(`/campanhas/${formData.slug}`);
	}

	return (
		<HookedForm.Form<FormData>
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput<FormData>
				fieldName="name"
				label="Nome"
				fontSize="lg"
				textCentered
				onChange={(event) => {
					form.setValue("slug", toSlug(event.target.value));
				}}
			/>
			<HookedForm.TextInput<FormData>
				fieldName="slug"
				label="Slug"
				fontSize="lg"
				textCentered
				disabled
			/>
			<HookedForm.Select<FormData>
				fieldName="type"
				label="Tipo"
				placeholder="Selecione um tipo"
				options={typeOptions}
			/>
			{/* <HookedForm.Select<FormData>
				fieldName="subType"
				label="Sub Tipo"
				placeholder="Selecione um subtipo"
				options={subTypeOptions}
				disabled
			/> */}
			<HookedForm.NumberInput<FormData>
				fieldName="maxPlayers"
				label="Limite de Jogadores"
				fontSize="lg"
				min={0}
				max={20}
			/>
			<HookedForm.BooleanInput<FormData>
				fieldName="isListed"
				label="Deve ser listado?"
				trueMessage="Sim"
				falseMessage="Não"
			/>
			<HookedForm.BooleanInput<FormData>
				fieldName="isOpen"
				label="Requer convite?"
				trueMessage="Não"
				falseMessage="Sim"
			/>
			<HookedForm.Space height={3} />

			<HookedForm.SubmitButton
				label="Criar"
				color="green"
			/>
		</HookedForm.Form>
	);
}
