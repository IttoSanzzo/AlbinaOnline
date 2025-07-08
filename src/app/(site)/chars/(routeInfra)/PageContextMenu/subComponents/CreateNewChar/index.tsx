import { Dialog, DropdownMenu } from "@/libs/stp@radix";
import { CreateCharForm } from "./CreateCharForm";

export function CreateNewChar() {
	return (
		<Dialog.Root>
			<DropdownMenu.DialogTrigger
				iconProps={{ name: "PlusCircle", style: "bold" }}>
				Criar nova ficha
			</DropdownMenu.DialogTrigger>

			<Dialog.Portal>
				<Dialog.Content>
					<Dialog.Title style={{ marginBottom: 20 }}>
						Criar Personagem
					</Dialog.Title>
					<Dialog.Description />
					<CreateCharForm />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
