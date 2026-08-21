"use client";

import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { AlertDialog } from "@/libs/stp@radix";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import toast from "react-hot-toast";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const schema = z.object({
	ensureString: z.string(),
});

type FormData = z.infer<typeof schema>;

export function ExitCampaignForm() {
	const { member, loadedCampaignSlug } = useCurrentCampaignMember();
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			ensureString: "",
		},
	});
	if (member == null || loadedCampaignSlug == null) return null;

	async function onSubmit() {
		const toastId = toast.loading("Saindo...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/campaigns/${loadedCampaignSlug}/members/${member!.userId}`,
			),
			{ method: "DELETE" },
		);
		if (!response.ok) {
			const errorText = await response.text();
			if (errorText === '"The last master must sink with it\'s ship."')
				toast.error(
					"O último mestre de uma campanha não pode deixá-la sem excluí-la",
					{ id: toastId },
				);
			else toast.error("Falha ao sair", { id: toastId });
			return;
		}
		toast.success("Bye bye", { id: toastId });
		await revalidateTagByClientSide("/campaigns");
		router.push(`/campanhas`);
	}

	return (
		<HookedForm.Form
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextInput<FormData>
				fieldName="ensureString"
				label="Verificação"
				fontSize="lg"
				textCentered
				placeholder="Eu sei o que estou fazendo"
				autoFocus
			/>
			<HookedForm.Space height={3} />

			<AlertDialog.ButtonsContainer>
				<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
				<HookedForm.SubmitButton
					label="Excluir"
					color="red"
					disabled={
						form.watch("ensureString").toLocaleLowerCase() !=
						"eu sei o que estou fazendo"
					}>
					Sair
				</HookedForm.SubmitButton>
			</AlertDialog.ButtonsContainer>
		</HookedForm.Form>
	);
}
