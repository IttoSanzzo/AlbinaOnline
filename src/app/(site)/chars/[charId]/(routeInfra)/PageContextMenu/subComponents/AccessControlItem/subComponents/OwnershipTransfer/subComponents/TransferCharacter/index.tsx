"use client";

import { Guid } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { AlertDialog } from "@/libs/stp@radix";
import { TransferCharForm } from "./subComponents/TransferCharForm";

const TransferCharacterContainer = newStyledElement.div(
	styles.transferCharacterContainer
);
const TransferCharacterButton = newStyledElement.button(
	styles.transferCharacterButton
);

interface TransferCharacterProps {
	characterId: Guid;
	characterName: string;
	disabled: boolean;
}
export function TransferCharacter({
	characterId,
	characterName,
	disabled,
}: TransferCharacterProps) {
	return (
		<TransferCharacterContainer>
			<AlertDialog.Root>
				<AlertDialog.Trigger asChild>
					<TransferCharacterButton disabled={disabled}>
						Transferir Posse
					</TransferCharacterButton>
				</AlertDialog.Trigger>

				<AlertDialog.Portal>
					<AlertDialog.Overlay />
					<AlertDialog.Content>
						<AlertDialog.Title style={{ marginBottom: 20 }}>
							Transferir Personagem
						</AlertDialog.Title>
						<AlertDialog.Description>
							Esse processo é definitivo e simplesmente não pode ser desfeito.
							Tenha absoluta certeza do que está fazendo.
						</AlertDialog.Description>
						<TransferCharForm
							characterId={characterId}
							characterName={characterName}
						/>
					</AlertDialog.Content>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</TransferCharacterContainer>
	);
}
