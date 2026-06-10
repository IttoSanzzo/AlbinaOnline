import { Guid } from "@/libs/stp@types";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { useEffect } from "react";

const schema = z.object({
	notes: z.string(),
});

type FormData = z.infer<typeof schema>;

interface NotesEditionCoreProps {
	characterId: Guid;
	entityId: Guid;
	targetType: "skill" | "spell" | "trait";
	defaultValue?: string;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
}
export function NotesEditionCore({
	characterId,
	entityId,
	targetType,
	defaultValue = "",
	setOpenState,
}: NotesEditionCoreProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { notes: defaultValue },
	});

	useEffect(() => {
		if (!form.formState.isDirty) form.reset({ notes: defaultValue });
	}, [defaultValue]);

	async function onSubmit(formData: FormData) {
		const body = {
			notes: formData.notes,
		};

		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/chars/${characterId}/${targetType}s/${entityId}/notes`,
			),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.error("Erro durante salvamento", { id: toastId });
			return;
		}
		form.reset(formData);
		toast.success("Salvo", { id: toastId });
		setOpenState(false);
	}

	return (
		<HookedForm.Form<FormData>
			form={form}
			onSubmit={onSubmit}>
			<HookedForm.TextAreaInput<FormData>
				fieldName="notes"
				label="Notas"
			/>
			<HookedForm.SubmitButton label="Salvar" />
		</HookedForm.Form>
	);
}
