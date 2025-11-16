"use client";

import { AlertDialog, DropdownMenu } from "@/libs/stp@radix";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";
import { resetAllStores } from "@/libs/stp@hooks";

export function LogoutButton() {
	const router = useRouter();

	async function handleLogout() {
		const response = await fetch(`${getAlbinaApiFullAddress()}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
		if (response.status == 200) {
			resetAllStores();
			router.push("/");
		} else console.error("Something went bad with logout procedure.");
	}

	return (
		<AlertDialog.Root>
			<DropdownMenu.AlertDialogTrigger
				iconProps={{ name: "SignOut", color: "red", style: "bold" }}>
				Sair
			</DropdownMenu.AlertDialogTrigger>

			<AlertDialog.Portal>
				<AlertDialog.Overlay />
				<AlertDialog.Content>
					<AlertDialog.Title>Você tem certeza?</AlertDialog.Title>
					<AlertDialog.Description>
						Uma vez que sair, será necessário realizar login novamente para
						acessar o site.
					</AlertDialog.Description>
					<AlertDialog.ButtonsContainer alignment="end">
						<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
						<AlertDialog.Action onClick={handleLogout}>
							Sair agora
						</AlertDialog.Action>
					</AlertDialog.ButtonsContainer>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
