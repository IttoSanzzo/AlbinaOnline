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
import { StateSwitch } from "@/components/(UTILS)";

const AddImageButtonContainer = newStyledElement.div(
	styles.addImageButtonContainer,
);
const ButtonTrigger = newStyledElement.button(styles.buttonTrigger);

const schema = z.object({
	images: z
		.any()
		.transform((val): File[] => {
			if (val instanceof FileList) return Array.from(val);
			if (val instanceof File) return [val];
			if (Array.isArray(val)) return val;
			return [];
		})
		.refine((files) => files.length > 0, "Selecione ao menos uma imagem"),
});

type FormData = z.infer<typeof schema>;

interface AddImageButtonProps {
	url: string;
	reloadGalleryData?: () => Promise<void>;
	withoutMargin?: boolean;
}
export default function AddImageButton({
	url,
	reloadGalleryData,
	withoutMargin,
}: AddImageButtonProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [inBulkMode, setInBulkMode] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const form = useForm<
		z.input<typeof schema>,
		unknown,
		z.output<typeof schema>
	>({
		resolver: zodResolver(schema),
	});

	async function onSubmit(data: FormData) {
		const toastId = toast.loading("Salvando...");

		for (const image of data.images) {
			const bodyData = new FormData();
			bodyData.append("file", image);

			const response = await authenticatedFetchAsync(url, {
				method: "POST",
				body: bodyData,
			});
			if (!response.ok) {
				toast.error("Salvamento falhou", { id: toastId });
				setError("Salvamento falhou");
				return;
			}
		}
		setOpen(false);
		await revalidateTagByClientSide(url);
		toast.success("Salvo", { id: toastId });
		if (reloadGalleryData) await reloadGalleryData();
	}

	return (
		<AddImageButtonContainer
			className={withoutMargin ? styles.withoutMargin : undefined}>
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
								<StateSwitch
									label={"Bulk"}
									state={[inBulkMode, setInBulkMode]}
									style={{
										position: "absolute",
										top: 0,
										right: 0,
										borderTop: "none",
										borderRight: "none",
									}}
									onClickCheck={async (event) => {
										event.preventDefault();
										return true;
									}}
								/>
								<HookedForm.ImageInput<FormData>
									label="Insira nova imagem"
									fieldName="images"
									multiple={inBulkMode}
									minWidth={50}
									minHeight={50}
									maxSize={4_194_304}
									// maxWidth={5000}
									// maxHeight={5000}
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
