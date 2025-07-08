"use client";

import { AlertDialog, DropdownMenu } from "@/libs/stp@radix";
import styles from "./styles.module.css";
import { DialogButtonsContainer } from "./styledElements";
import clsx from "clsx";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useRouter } from "next/navigation";
import { resetAllStores } from "@/libs/stp@hooks";

export function LogoutButton() {
	const router = useRouter();

	async function handleLogout() {
		const response = await fetch(`${getAlbinaApiAddress()}/auth/logout`, {
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
				<AlertDialog.Overlay className={styles.dialogOverlay} />
				<AlertDialog.Content className={styles.dialogContainer}>
					<AlertDialog.Title className={styles.dialogTitle}>
						Você tem certeza?
					</AlertDialog.Title>
					<AlertDialog.Description className={styles.dialogDescription}>
						Uma vez que sair, será necessário realizar login novamente para
						acessar o site.
					</AlertDialog.Description>
					<DialogButtonsContainer>
						<AlertDialog.Cancel className={clsx(styles.dialogButton)}>
							Cancelar
						</AlertDialog.Cancel>
						<AlertDialog.Action
							className={clsx(styles.dialogButton, "red")}
							onClick={handleLogout}>
							Sair agora
						</AlertDialog.Action>
					</DialogButtonsContainer>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
