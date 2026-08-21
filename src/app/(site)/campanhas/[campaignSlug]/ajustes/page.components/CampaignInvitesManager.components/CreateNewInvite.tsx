import styles from "./CreateNewInvite.module.css";
import { Dialog } from "@/libs/stp@radix";
import { CampaignInvite } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateNewInviteForm } from "./CreateNewInviteForm";

interface CreateNewInviteProps {
	campaignSlug: string;
	setInvites: Dispatch<SetStateAction<CampaignInvite[]>>;
}
export function CreateNewInvite({
	campaignSlug,
	setInvites,
}: CreateNewInviteProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<Dialog.Root open={isOpen}>
			<Dialog.Trigger
				className={styles.trigger}
				onClick={() => setIsOpen(true)}>
				Criar Convite
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => setIsOpen(false)} />
				<Dialog.Content>
					<Dialog.Title textAlign="center">Criar Convite</Dialog.Title>
					<CreateNewInviteForm
						campaignSlug={campaignSlug}
						setInvites={setInvites}
						setIsOpen={setIsOpen}
					/>
					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
