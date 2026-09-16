"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignDDDiceSettingsManager.module.css";
import { Campaign } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";

const CampaignDDDiceSettingsManagerContainer = newStyledElement.div(
	styles.campaignDDDiceSettingsManagerContainer,
);

const schema = z.object({
	roomSlug: z.string(),
	roomPassword: z.string(),
});
type FormData = z.infer<typeof schema>;

interface CampaignDDDiceSettingsManagerProps {
	campaign: Campaign;
}
export function CampaignDDDiceSettingsManager({
	campaign,
}: CampaignDDDiceSettingsManagerProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			roomSlug: "",
			roomPassword: "",
		},
	});

	async function onSubmit(formData: FormData) {
		const body = {
			roomSlug: formData.roomSlug,
			roomPassword:
				formData.roomPassword != "" ? formData.roomPassword : undefined,
		};

		const toastId = toast.loading("Salvando...");
		const response =
			body.roomSlug != ""
				? await authenticatedFetchAsync(
						`/campaigns/${campaign.slug}/integrations/dddice`,
						{
							method: "Put",
							body: JSON.stringify(body),
							headers: { "Content-Type": "application/json" },
						},
					)
				: await authenticatedFetchAsync(
						`/campaigns/${campaign.slug}/integrations/dddice`,
						{
							method: "Delete",
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
		<CampaignDDDiceSettingsManagerContainer>
			<UIBasics.Header textColor="gray">
				Configurações do DDDice
			</UIBasics.Header>
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}>
				<UIBasics.MultiColumn.Two
					colum1={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}>
							<HookedForm.TextInput<FormData>
								fieldName="roomSlug"
								label="Slug da Sala"
							/>
						</div>
					}
					colum2={
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}>
							<HookedForm.PasswordInput<FormData>
								fieldName="roomPassword"
								label="Senha da Sala"
							/>
						</div>
					}
				/>
				<HookedForm.SubmitButton label="Salvar" />
			</HookedForm.Form>
		</CampaignDDDiceSettingsManagerContainer>
	);
}
