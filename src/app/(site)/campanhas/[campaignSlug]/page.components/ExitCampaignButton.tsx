"use client";

import { AlertDialog, DropdownMenu } from "@/libs/stp@radix";
import { ExitCampaignForm } from "./ExitCampaignButton.components/ExitCampaingForm";
import { UIBasics } from "@/components/(UIBasics)";

export function ExitCampaignButton() {
	return (
		<AlertDialog.Root>
			<DropdownMenu.AlertDialogTrigger
				iconProps={{ name: "SignOut", style: "bold" }}>
				Sair da Campanha
			</DropdownMenu.AlertDialogTrigger>

			<AlertDialog.Portal>
				<AlertDialog.Overlay />
				<AlertDialog.Content>
					<AlertDialog.Title
						style={{ marginBottom: 20 }}
						textAlign="center">
						Saindo da campanha
					</AlertDialog.Title>
					<UIBasics.Text textColor="gray">
						Digite a frase de confirmação
					</UIBasics.Text>
					<AlertDialog.Description />
					<ExitCampaignForm />
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
