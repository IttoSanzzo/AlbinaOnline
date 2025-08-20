import { HookedForm } from "@/libs/stp@forms";
import { AlertDialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import styles from "./styles.module.css";

const DeleteButton = newStyledElement.button(styles.deleteButton);

const schema = z.object({
	safetyLine: z.string(),
});
type FormData = z.infer<typeof schema>;

interface DeletionAlertDialogProps {
	safetyText: string;
	deletionRoute: string;
	routerPushRoute?: string;
}
export function DeletionAlertDialog({
	deletionRoute,
	safetyText,
	routerPushRoute,
}: DeletionAlertDialogProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	const watchedValues = form.watch();

	async function onSubmit(data: FormData) {
		if (data.safetyLine !== safetyText) return;
		const toastId = toast.loading("Deleting...");
		const response = await authenticatedFetchAsync(deletionRoute, {
			method: "DELETE",
		});
		if (!response.ok) {
			toast.error("Deletion error", { id: toastId });
		}
		toast.success("Deleted", { id: toastId });
		setOpenState(false);
		router.push(routerPushRoute ? routerPushRoute : "/home");
	}

	return (
		<AlertDialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<AlertDialog.Trigger asChild>
				<DeleteButton>Deletar</DeleteButton>
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay>
					<AlertDialog.Content>
						<AlertDialog.Title>Deletion</AlertDialog.Title>
						<HookedForm.Form
							form={form}
							onSubmit={onSubmit}>
							<HookedForm.TextInput
								fieldName="safetyLine"
								label="Safety Input"
								placeholder={safetyText}
							/>
							<AlertDialog.ButtonsContainer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<HookedForm.SubmitButton
									label="Delete"
									disabled={watchedValues.safetyLine !== safetyText}
								/>
							</AlertDialog.ButtonsContainer>
						</HookedForm.Form>
					</AlertDialog.Content>
				</AlertDialog.Overlay>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
