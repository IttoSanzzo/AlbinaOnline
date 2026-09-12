"use client";

import styles from "./GridMapsCreationForm.module.css";
import { Guid } from "@/libs/stp@types";
import { Dispatch, SetStateAction } from "react";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

interface GridMapsCreationFormProps {
	setEditingGridMapId: Dispatch<SetStateAction<Guid | null>>;
	setCreatorOpenState: Dispatch<SetStateAction<boolean>>;
}
export function GridMapsCreationForm({
	setEditingGridMapId,
	setCreatorOpenState,
}: GridMapsCreationFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: {
			image: undefined,
		},
	});

	async function handleSubmit(data: FormData) {
		const toastId = toast.loading("Enviando imagem...");

		const formData = new FormData();
		formData.append("name", "undefined");
		formData.append("width", "100");
		formData.append("height", "100");
		formData.append("offsetX", "0");
		formData.append("offsetY", "0");
		formData.append("file", data.image);

		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/gridmaps`),
			{
				method: "Post",
				body: formData,
			},
		);
		if (!response.ok) {
			toast.error("Erro ao enviar imagem!", { id: toastId });
			return;
		}
		toast.success("Imagem enviada", { id: toastId });
		const payload = await response.json();
		setCreatorOpenState(false);
		setEditingGridMapId(payload.id);
		form.reset();
		await revalidateTagByClientSide("/gridmaps");
	}

	return (
		<HookedForm.Form<FormData>
			form={form}
			className={styles.form}
			onSubmit={handleSubmit}>
			<HookedForm.ImageInput<FormData>
				fieldName={"image"}
				maxFiles={1}
				maxSize={20_971_520}
				maxWidth={20_000_000}
				maxHeight={20_000_000}
				previewMaxHeight={740}
			/>
			<HookedForm.SubmitButton
				label={"Continuar 1/2"}
				color={"blue"}
			/>
		</HookedForm.Form>
	);
}
