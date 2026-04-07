"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { Dialog } from "@/libs/stp@radix";
import { HookedForm } from "@/libs/stp@forms";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const AddImageButtonContainer = newStyledElement.div(
	styles.addImageButtonContainer,
);
const ButtonTrigger = newStyledElement.button(styles.buttonTrigger);

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

interface AddImageButtonProps {
	url: string;
	reloadGalleryData?: () => Promise<void>;
}
export default function AddImageButton({
	url,
	reloadGalleryData,
}: AddImageButtonProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const bodyData = new FormData();
		bodyData.append("file", data.image);

		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(url, {
			method: "POST",
			body: bodyData,
		});
		if (!response.ok) {
			toast.error("Salvamento falhou", { id: toastId });
			setError("Salvamento falhou");
			return;
		}
		setOpen(false);
		await revalidateTagByClientSide(url);
		toast.success("Salvo", { id: toastId });
		if (reloadGalleryData) await reloadGalleryData();
	}

	return (
		<AddImageButtonContainer>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<ButtonTrigger>
						<StpIcon
							name="Upload"
							color="purple"
							style="bold"
						/>
					</ButtonTrigger>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content>
							<Dialog.Title textAlign="center">Enviar Imagem</Dialog.Title>
							<Dialog.Description />
							<HookedForm.Form
								form={form}
								onSubmit={onSubmit}>
								<HookedForm.ImageInput
									label="Insira nova imagem"
									fieldName="image"
									minWidth={50}
									minHeight={50}
									maxSize={4_194_304}
									maxWidth={4000}
									maxHeight={2000}
								/>
								<HookedForm.SubmitButton label="Salvar" />
								{error && (
									<HookedForm.SimpleMessage
										color="red"
										message={error}
									/>
								)}
							</HookedForm.Form>
						</Dialog.Content>
					</Dialog.Overlay>
				</Dialog.Portal>
			</Dialog.Root>
		</AddImageButtonContainer>
	);
}
