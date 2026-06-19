import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import { useForm } from "react-hook-form";

type FormData = { notes: string };

interface MetricsNotesProps {
	coreMetrics: CharacterCoreMetrics;
}
export function MetricsNotes({ coreMetrics }: MetricsNotesProps) {
	const form = useForm<FormData>({
		defaultValues: {
			notes: coreMetrics.notes,
		},
	});

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
			<HookedForm.Form form={form}>
				<HookedForm.TextAreaInput<FormData>
					fieldName="notes"
					label="Notas de Estatísticas"
					style={{ color: "var(--cl-gray-200)" }}
					disabled
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
