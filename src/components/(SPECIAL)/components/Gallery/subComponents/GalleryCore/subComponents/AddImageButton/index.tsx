"use client";

import { StpIcon } from "@/libs/stp@icons";
import styles from "./styles.module.css";
import { newStyledElement } from "@setsu-tp/styled-components";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { Dialog } from "@/libs/stp@radix";
import { HookedForm } from "@/libs/stp@forms";
import { revalidateTagByClientSide } from "@/utils/ServerActions";
import { StateSwitch } from "@/components/(UTILS)";
import { ImageInputHandle } from "@/libs/stp@forms/components/ImageInput";
import { extractImageFromDrop } from "@/libs/stp@forms/components/ImageInput/utils";

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

export interface AddImageButtonHandle {
	openByDragEvent: (event: React.DragEvent) => Promise<void>;
}

interface AddImageButtonProps {
	url: string;
	reloadGalleryData?: () => Promise<boolean>;
	withoutMargin?: boolean;
}
export const AddImageButton = forwardRef<
	AddImageButtonHandle,
	AddImageButtonProps
>(function AddImageButton(
	{ url, reloadGalleryData, withoutMargin }: AddImageButtonProps,
	ref,
) {
	const [pendingImage, setPendingImage] = useState<File | null>(null);
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

	const imageInputRef = useRef<ImageInputHandle | null>(null);
	const handleImageInputRef = (node: ImageInputHandle | null) => {
		imageInputRef.current = node;
		if (node && pendingImage)
			node.setImage(pendingImage).then(() => {
				setPendingImage(null);
			});
	};
	useEffect(() => {
		if (!open || !imageInputRef.current || !pendingImage) return;
		const current = pendingImage;
		imageInputRef.current.setImage(current).then(() => {
			setPendingImage(null);
		});
	}, [pendingImage, open]);

	useImperativeHandle(
		ref,
		() => ({
			openByDragEvent: async (event: React.DragEvent): Promise<void> => {
				const image = await extractImageFromDrop(event);
				if (!image) return;
				setPendingImage(image);
				setOpen(true);
			},
		}),
		[],
	);

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
									ref={handleImageInputRef}
									label="Insira nova imagem"
									fieldName="images"
									multiple={inBulkMode}
									minWidth={50}
									minHeight={50}
									maxSize={4_194_304}
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
});
