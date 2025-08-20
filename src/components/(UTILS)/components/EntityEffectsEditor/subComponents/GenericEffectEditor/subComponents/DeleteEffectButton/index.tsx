import { HookedForm } from "@/libs/stp@forms";
import { AlertDialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import styles from "./styles.module.css";
import { Guid } from "@/libs/stp@types";
import { revalidatePathByClientSide } from "@/utils/ServerActions";

const DeleteButton = newStyledElement.button(styles.deleteButton);

const schema = z.object({
	safetyLine: z.string(),
});
type FormData = z.infer<typeof schema>;

interface DeleteEffectButtonProps {
	safetyText: string;
	effectId: Guid;
	pathname: string;
	revalidatePath?: string;
}
export function DeleteEffectButton({
	safetyText,
	effectId,
	pathname,
	revalidatePath,
}: DeleteEffectButtonProps) {
	const [openState, setOpenState] = useState<boolean>(false);
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	const watchedValues = form.watch();

	async function onSubmit(data: FormData) {
		if (data.safetyLine !== safetyText) return;
		const toastId = toast.loading("Deleting Effect...");
		const response = await authenticatedFetchAsync(`/effects/${effectId}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			toast.error("Deletion error", { id: toastId });
			return;
		}
		toast.success("Deleted", { id: toastId });
		setOpenState(false);
		revalidatePathByClientSide(pathname);
		if (revalidatePath) revalidatePathByClientSide(revalidatePath);
	}

	return (
		<AlertDialog.Root
			open={openState}
			onOpenChange={setOpenState}>
			<AlertDialog.Trigger asChild>
				<DeleteButton>Delete Effect</DeleteButton>
			</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay>
					<AlertDialog.Content>
						<AlertDialog.Title>Delete!!</AlertDialog.Title>
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
									color="red"
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
