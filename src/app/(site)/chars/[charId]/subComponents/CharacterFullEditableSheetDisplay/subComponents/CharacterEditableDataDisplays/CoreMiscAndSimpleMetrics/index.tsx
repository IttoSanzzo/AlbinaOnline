import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterCoreMetrics, CharacterMiscMetrics } from "@/libs/stp@types";
import { MiscMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";

const schemaCore = z.object({
	walkSpeed: z.coerce.number().min(0, "Mínimo de 0"),
	combatSpeed: z.coerce.number().min(0, "Mínimo de 0"),
	swimSpeed: z.coerce.number().min(0, "Mínimo de 0"),
	flySpeed: z.coerce.number().min(0, "Mínimo de 0"),
	armorClass: z.coerce.number().min(0, "Mínimo de 0"),
	initiative: z.coerce.number().min(0, "Mínimo de 0"),
});
const schemaMisc = z.object({
	carryCapacity: z.coerce.number().min(0, "Mínimo de 0"),
});
type FormDataCore = z.infer<typeof schemaCore>;
type FormDataMisc = z.infer<typeof schemaMisc>;

function formTableEntry(
	control: Control<FormDataCore> | Control<FormDataMisc>,
	title: string,
	fieldName: keyof FormDataCore | keyof FormDataMisc
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInputInline
			control={control}
			fieldName={fieldName}
			min={0}
		/>,
	];
}

export function CoreMiscAndSimpleMetrics() {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);
	const { coreMetrics, setCoreMetrics } = useContext(CoreMetricsContext);
	const { miscMetrics, setMiscMetrics } = useContext(MiscMetricsContext);

	const formCore = useForm<FormDataCore>({
		resolver: zodResolver(schemaCore),
		defaultValues: {
			walkSpeed: coreMetrics.speedStats.walkSpeed,
			combatSpeed: coreMetrics.speedStats.combatSpeed,
			swimSpeed: coreMetrics.speedStats.swimSpeed,
			flySpeed: coreMetrics.speedStats.flySpeed,
			armorClass: coreMetrics.armorClass,
			initiative: coreMetrics.initiative,
		},
	});
	const formMisc = useForm<FormDataMisc>({
		resolver: zodResolver(schemaMisc),
		defaultValues: {
			carryCapacity: miscMetrics.carryCapacity,
		},
	});

	async function onCoreFormChange(formData: FormDataCore) {
		const body: CharacterCoreMetrics = {
			...coreMetrics,
			speedStats: {
				walkSpeed: formData.walkSpeed,
				combatSpeed: formData.combatSpeed,
				swimSpeed: formData.swimSpeed,
				flySpeed: formData.flySpeed,
			},
			armorClass: formData.armorClass,
			initiative: formData.initiative,
			characterId: characterId,
		};
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/core-metrics`,
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.ok == false) {
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setCoreMetrics(body);
		setErrorMessage("");
		return true;
	}
	async function onMiscFormChange(formData: FormDataMisc) {
		const body: CharacterMiscMetrics = {
			...miscMetrics,
			characterId: characterId,
			carryCapacity: formData.carryCapacity,
		};
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/misc-metrics`,
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.ok == false) {
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setMiscMetrics(body);
		setErrorMessage("");
		return true;
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Miscs"
			memoryId={`${characterId}-MiscMetrics`}>
			<HookedForm.Form style={{ display: "flex" }}>
				<HookedForm.WatchedAction<FormDataCore>
					watch={formCore.watch}
					isValid={formCore.formState.isValid}
					action={onCoreFormChange}
				/>
				<HookedForm.WatchedAction<FormDataMisc>
					watch={formMisc.watch}
					isValid={formMisc.formState.isValid}
					action={onMiscFormChange}
				/>

				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry(formMisc.control, "Carga Máxima", "carryCapacity"),
							formTableEntry(formCore.control, "Iniciativa", "initiative"),
							formTableEntry(formCore.control, "C.A.", "armorClass"),
							formTableEntry(formCore.control, "Mov. de Andar", "walkSpeed"),
							formTableEntry(
								formCore.control,
								"Mov. de Combate",
								"combatSpeed"
							),
							formTableEntry(formCore.control, "Mov. de Nado", "swimSpeed"),
							formTableEntry(formCore.control, "Mov. de Voo", "flySpeed"),
						],
					}}
				/>
				<HookedForm.SimpleMessage
					message={
						formCore.formState.isValid || formMisc.formState.isValid
							? errorMessage
							: "Valor inválido detectado"
					}
					color="red"
				/>
			</HookedForm.Form>
		</UIBasics.ToggleHeader>
	);
}
