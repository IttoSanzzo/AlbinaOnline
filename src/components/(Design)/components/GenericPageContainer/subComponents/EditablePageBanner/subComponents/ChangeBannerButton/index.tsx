"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Dialog } from "@/libs/stp@radix";
import { StpIcon } from "@/libs/stp@icons";
import { DialogDescription } from "@radix-ui/react-dialog";
import { HookedForm } from "@/libs/stp@forms";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dispatch,
	forwardRef,
	SetStateAction,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import toast from "react-hot-toast";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import {
	extractImageFromDrop,
	ImageInputHandle,
} from "@/libs/stp@forms/components/ImageInput";
import { eventBus } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const ChangeBannerButtonContainer = newStyledElement.div(
	styles.changeBannerButtonContainer,
);
const ChangeBannerButtonTrigger = newStyledElement.button(
	styles.changeBannerButtonTrigger,
);

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

export interface ChangeBannerButtonHandle {
	openByDragEvent: (event: React.DragEvent) => Promise<void>;
}

interface ChangeBannerButtonProps {
	bannerSrc: string;
	setBanner: Dispatch<SetStateAction<string>>;
	route: string;
	cacheTags?: string[];
	cachePaths?: string[];
}
export const ChangeBannerButton = forwardRef<
	ChangeBannerButtonHandle,
	ChangeBannerButtonProps
>(function ChangeBannerButton(
	{
		bannerSrc,
		setBanner,
		route,
		cachePaths,
		cacheTags,
	}: ChangeBannerButtonProps,
	ref,
) {
	const [pendingImage, setPendingImage] = useState<File | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const form = useForm<FormData>({
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

	async function onSubmit(data: FormData) {
		const bodyData = new FormData();
		bodyData.append("file", data.image);

		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(route, {
			method: "PUT",
			body: bodyData,
		});
		if (!response.ok) {
			toast.error("Salvamento falhou", { id: toastId });
			setError("Salvamento falhou");
			return;
		}
		setOpen(false);
		setBanner(`${bannerSrc}?t=${Date.now()}`);
		toast.success("Salvo", { id: toastId });
		const galleryEventKey = getAlbinaApiFullAddress(
			`/images/${route.substring(getAlbinaApiFullAddress("/banner/").length)}`,
		);
		eventBus.emitAsync(galleryEventKey, undefined);
		if (cacheTags)
			for (const tag of cacheTags) await revalidateTagByClientSide(tag);
		if (cachePaths)
			for (const path of cachePaths) await revalidatePathByClientSide(path);
	}

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

	return (
		<ChangeBannerButtonContainer>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}>
				<Dialog.Trigger asChild>
					<ChangeBannerButtonTrigger>
						{StpIcon({ name: "PencilSimple", color: "yellow", style: "bold" })}
					</ChangeBannerButtonTrigger>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay>
						<Dialog.Content>
							<Dialog.Title textAlign="center">Novo Banner</Dialog.Title>
							<DialogDescription />
							<HookedForm.Form
								form={form}
								onSubmit={onSubmit}>
								<HookedForm.ImageInput
									ref={handleImageInputRef}
									label="Insira nova imagem"
									fieldName="image"
									minWidth={735}
									minHeight={280}
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
		</ChangeBannerButtonContainer>
	);
});
