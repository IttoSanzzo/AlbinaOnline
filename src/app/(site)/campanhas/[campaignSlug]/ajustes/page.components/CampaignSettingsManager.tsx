"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignSettingsManager.module.css";
import { Campaign, CampaignType } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm, zEnumKey } from "@/libs/stp@forms";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { campaignTypeOptions } from "../../../page.infra/PageContextMenu.components/CreateNewCampaign.components/CreateCampaignForm";

const CampaignSettingsManagerContainer = newStyledElement.div(
	styles.campaignSettingsManagerContainer,
);

const schema = z.object({
	type: zEnumKey(CampaignType),
	isListed: z.boolean(),
	isOpen: z.boolean(),
	maxPlayers: z.number().min(1, "Min 1").max(20, "Max 20"),
});

type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CampaignSettingsManagerProps {
	campaign: Campaign;
}
export function CampaignSettingsManager({
	campaign,
}: CampaignSettingsManagerProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			type: campaign.type,
			isListed: campaign.isListed,
			isOpen: campaign.isOpen,
			maxPlayers: campaign.maxPlayers,
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			...campaign,
			...formData,
		};
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}`,
			{
				method: "Put",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Erro", { id: toastId });
			return;
		}
		toast.success("Salvo", { id: toastId });
		window.location.reload();
	}

	return (
		<CampaignSettingsManagerContainer>
			<UIBasics.Header textColor="gray">Configurações</UIBasics.Header>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<HookedForm.Select<FormData>
					fieldName="type"
					label="Tipo"
					options={campaignTypeOptions}
				/>
				<HookedForm.BooleanInput<FormData>
					fieldName="isListed"
					trueMessage="Listado"
					falseMessage="Não Listado"
					label="Listado"
				/>
				<HookedForm.BooleanInput<FormData>
					fieldName="isOpen"
					trueMessage="Aberto"
					falseMessage="Fechado"
					label="Aberto para Todos"
				/>
				<HookedForm.NumberInput<FormData>
					fieldName="maxPlayers"
					label="Limite de Jogadores"
					min={Math.max(1, campaign.playerCount)}
					max={20}
				/>
				<HookedForm.SubmitButton label="Salvar" />
			</HookedForm.Form>
		</CampaignSettingsManagerContainer>
	);
}
