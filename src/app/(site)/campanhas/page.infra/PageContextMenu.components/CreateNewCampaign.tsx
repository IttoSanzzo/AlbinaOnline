import { Dialog, DropdownMenu } from "@/libs/stp@radix";
import { CreateCampaignForm } from "./CreateNewCampaign.components/CreateCampaignForm";

export function CreateNewCampaign() {
	return (
		<Dialog.Root>
			<DropdownMenu.DialogTrigger
				iconProps={{ name: "PlusCircle", style: "bold" }}>
				Criar nova ficha
			</DropdownMenu.DialogTrigger>

			<Dialog.Portal>
				<Dialog.Overlay />
				<Dialog.Content>
					<Dialog.Title
						style={{ marginBottom: 20 }}
						textAlign="center">
						Criar Campanha
					</Dialog.Title>
					<Dialog.Description />
					<CreateCampaignForm />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
