"use client";

import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { Campaign } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
	summary: z.array(z.string()),
	description: z.array(z.string()),
	miscellaneous: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

interface CampaignInfoEditorProps {
	campaign: Campaign;
}
export function CampaignInfoEditor({ campaign }: CampaignInfoEditorProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			summary: campaign.info.summary,
			description: campaign.info.description,
			miscellaneous: campaign.info.miscellaneous,
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}/info`,
			{
				method: "Put",
				body: JSON.stringify({
					info: formData,
				}),
				headers: { "Content-Type": "application/json" },
			},
		);
		if (!response.ok) {
			toast.error("Erro ao salvar", { id: toastId });
			return;
		}
		toast.success("Salvo", { id: toastId });
		return true;
	}

	return (
		<UIBasics.Box>
			<HookedForm.Form<FormData>
				form={form}
				onSubmit={onSubmit}>
				<UIBasics.MultiColumn.Three
					withoutPadding
					colum1={
						<HookedForm.TextArrayInput<FormData>
							fieldName="summary"
							useTextArea
						/>
					}
					colum2={
						<HookedForm.TextArrayInput<FormData>
							fieldName="description"
							useTextArea
						/>
					}
					colum3={
						<HookedForm.TextArrayInput<FormData>
							fieldName="miscellaneous"
							useTextArea
						/>
					}
				/>

				<HookedForm.SubmitButton label="Salvar" />
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
