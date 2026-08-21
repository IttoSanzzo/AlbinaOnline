"use client";

import { Campaign } from "@/libs/stp@types";
import styles from "./DeleteCampaignAlertDialog.module.css";
import { AlertDialog } from "@/libs/stp@radix";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HookedForm } from "@/libs/stp@forms";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { useRouter } from "next/navigation";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";

type FormData = {
	safeString: string;
};

interface DeleteCampaignAlertDialogProps {
	campaign: Campaign;
}
export function DeleteCampaignAlertDialog({
	campaign,
}: DeleteCampaignAlertDialogProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const router = useRouter();
	const isDisabled: boolean = campaign.masterCount > 1;

	const form = useForm<FormData>({
		mode: "all",
		defaultValues: {
			safeString: "",
		},
	});
	const safeString = form.watch().safeString;

	async function handleDeletion() {
		const toastId = toast.loading("Deletando campanha...");
		const response = await authenticatedFetchAsync(
			`/campaigns/${campaign.slug}`,
			{
				method: "Delete",
			},
		);
		if (!response.ok) {
			toast.error("Erro ao deletar campanha", { id: toastId });
			return;
		}
		toast.success("Campanha deletada", { id: toastId });
		await revalidatePathByClientSide("/campanhas");
		await revalidateTagByClientSide("/campaigns");
		router.push("/campanhas");
	}

	return (
		<AlertDialog.Root open={isOpen}>
			<AlertDialog.Trigger
				className={styles.trigger}
				disabled={isDisabled}
				onClick={() => setIsOpen(true)}
				title={
					isDisabled
						? "Uma campanha só pode ser deletada quando houver apenas 1 mestre restante nela"
						: ""
				}>
				Deletar Campanha
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay
					onClick={() => {
						form.reset();
						setIsOpen(false);
					}}
				/>
				<AlertDialog.Content>
					<AlertDialog.Title textAlign="center">
						Deletar Campanha
					</AlertDialog.Title>
					<AlertDialog.Description>
						Você tem certeza? Deletar uma campanha é um processo sem volta. Ela
						estará perdida para todo e todo o sempre.
					</AlertDialog.Description>
					<AlertDialog.Description>
						Para confirmar, digite o nome da campanha abaixo:
					</AlertDialog.Description>
					<HookedForm.Form
						form={form}
						onSubmit={handleDeletion}>
						<HookedForm.TextInput<FormData>
							fieldName="safeString"
							placeholder={campaign.name}
							label="Nome da campanha"
						/>
						<HookedForm.Space />
						<AlertDialog.ButtonsContainer alignment="space-around">
							<AlertDialog.Cancel
								onClick={() => {
									form.reset();
									setIsOpen(false);
								}}>
								Cancelar
							</AlertDialog.Cancel>
							<AlertDialog.Action
								onClick={handleDeletion}
								disabled={safeString != campaign.name}>
								Deletar
							</AlertDialog.Action>
						</AlertDialog.ButtonsContainer>
					</HookedForm.Form>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
