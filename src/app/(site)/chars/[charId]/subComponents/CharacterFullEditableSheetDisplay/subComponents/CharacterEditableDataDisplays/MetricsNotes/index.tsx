import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { Guid } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { CharToastMessage } from "..";

const schema = z.object({
	notes: z.string(),
});
type FormData = z.infer<typeof schema>;

interface MetricsNotesProps {
	characterId: Guid;
}
export function MetricsNotes({ characterId }: MetricsNotesProps) {
	const { coreMetrics } = useContext(CoreMetricsContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			notes: coreMetrics.notes,
		},
	});
	useEffect(() => {
		if (!form.formState.isDirty) form.reset({ notes: coreMetrics.notes });
	}, [coreMetrics.notes]);

	async function handleSubmit(formData: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/core-metrics`),
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...coreMetrics, notes: formData.notes }),
			},
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutBorder
			withoutBorderRadius
			withoutMargin
			style={{
				borderBottomLeftRadius: "var(--rd-md)",
				borderBottomRightRadius: "var(--rd-md)",
			}}>
			<HookedForm.Form
				form={form}
				actionDebounceMs={1000 * 2}
				onChangeAction={handleSubmit}>
				<HookedForm.TextAreaInput<FormData>
					fieldName="notes"
					label="Notas de Estatísticas"
					style={{ color: "var(--cl-gray-200)" }}
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
