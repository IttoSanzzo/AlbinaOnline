import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
	notes: z.string(),
});
type FormData = z.infer<typeof schema>;

interface ProfileNotesProps {
	characterId: Guid;
	notes: string;
}
export function ProfileNotes({ characterId, notes }: ProfileNotesProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			notes: notes,
		},
	});
	useEffect(() => {
		if (!form.formState.isDirty) form.reset({ notes: notes });
	}, [notes]);

	async function handleSubmit(formData: FormData) {
		const toastId = toast.loading("Salvando...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/profile/notes`),
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			},
		);
		if (!response.ok) {
			toast.error("Erro durante salvamento", { id: toastId });
			return;
		}
		toast.success("Salvo", { id: toastId });
		return true;
	}

	return (
		<UIBasics.Box backgroundColor="darkGray">
			<HookedForm.Form
				form={form}
				actionDebounceMs={1000 * 2}
				onChangeAction={handleSubmit}>
				<HookedForm.TextAreaInput<FormData>
					fieldName="notes"
					label="Notas Pessoais"
					style={{ color: "var(--cl-gray-200)" }}
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
