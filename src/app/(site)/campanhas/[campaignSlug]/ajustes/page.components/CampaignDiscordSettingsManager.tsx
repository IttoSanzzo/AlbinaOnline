"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./CampaignDiscordSettingsManager.module.css";
import { Campaign } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";

const CampaignDiscordSettingsManagerContainer = newStyledElement.div(
	styles.campaignDiscordSettingsManagerContainer,
);

const isValidDiscordId = (id: string) => {
	return /^\d{17,20}$/.test(id);
};

const schema = z
	.object({
		serverId: z.string().refine((id) => id === "" || isValidDiscordId(id), {
			message: "Must be a valid Discord ID.",
		}),
		chatChannelId: z
			.string()
			.refine((id) => id === "" || isValidDiscordId(id), {
				message: "Must be a valid Discord ID.",
			}),

		diceChannelId: z
			.string()
			.refine((id) => id === "" || isValidDiscordId(id), {
				message: "Must be a valid Discord ID.",
			}),

		voiceChannelIds: z
			.array(
				z.string().refine((id) => isValidDiscordId(id), {
					message: "Must be a valid Discord ID.",
				}),
			)
			.refine((ids) => new Set(ids).size === ids.length, {
				message: "Voice channel IDs must be unique.",
			}),
	})
	.refine(
		(data) => {
			const hasDiscordConfiguration =
				data.chatChannelId !== "" ||
				data.diceChannelId !== "" ||
				data.voiceChannelIds.length > 0;

			return !hasDiscordConfiguration || data.serverId !== "";
		},
		{
			path: ["serverId"],
			message: "Server ID is required when Discord settings are configured.",
		},
	);
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

interface CampaignDiscordSettingsManagerProps {
	campaign: Campaign;
}
export function CampaignDiscordSettingsManager({
	campaign,
}: CampaignDiscordSettingsManagerProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			serverId: campaign.discordSettings?.serverId ?? "",
			chatChannelId: campaign.discordSettings?.chatChannelId ?? "",
			diceChannelId: campaign.discordSettings?.diceChannelId ?? "",
			voiceChannelIds: campaign.discordSettings?.voiceChannelIds ?? [],
		},
	});
	const { serverId } = form.watch();
	const serverIdIsMissingOrInvalid =
		serverId == "" || !isValidDiscordId(serverId);

	async function onSubmit(formData: FormData) {
		const body = {
			...campaign,
			discordSettings:
				formData.serverId == ""
					? undefined
					: {
							serverId: formData.serverId != "" ? formData.serverId : undefined,
							chatChannelId:
								formData.chatChannelId != ""
									? formData.chatChannelId
									: undefined,
							diceChannelId:
								formData.diceChannelId != ""
									? formData.diceChannelId
									: undefined,
							voiceChannelIds:
								formData.voiceChannelIds.length != 0
									? formData.voiceChannelIds
									: undefined,
						},
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
		<CampaignDiscordSettingsManagerContainer>
			<UIBasics.Header textColor="gray">Configurações</UIBasics.Header>
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
								fieldName="serverId"
								label="ID do Servidor"
							/>
							<HookedForm.TextInput<FormData>
								fieldName="chatChannelId"
								label="ID do Chat"
								disabled={serverIdIsMissingOrInvalid}
							/>
							<HookedForm.TextInput<FormData>
								fieldName="diceChannelId"
								label="ID do canal de Dados"
								disabled={serverIdIsMissingOrInvalid}
							/>
						</div>
					}
					colum2={
						<HookedForm.TextArrayInput<FormData>
							fieldName="voiceChannelIds"
							label="IDs dos canais de Voz"
							disabled={serverIdIsMissingOrInvalid}
						/>
					}
				/>
				<HookedForm.SubmitButton label="Salvar" />
			</HookedForm.Form>
		</CampaignDiscordSettingsManagerContainer>
	);
}
