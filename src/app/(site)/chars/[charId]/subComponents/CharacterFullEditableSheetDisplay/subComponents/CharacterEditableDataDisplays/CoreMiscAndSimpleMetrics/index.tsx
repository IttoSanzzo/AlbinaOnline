import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterCoreMetrics, CharacterMiscMetrics } from "@/libs/stp@types";
import { MiscMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/MiscMetrics";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

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
	title: string,
	fieldName: keyof FormDataCore | keyof FormDataMisc
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInputInline
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
		const toastId = toast.loading(CharToastMessage.loading);
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
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setCoreMetrics(body);
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}
	async function onMiscFormChange(formData: FormDataMisc) {
		const body: CharacterMiscMetrics = {
			...miscMetrics,
			characterId: characterId,
			carryCapacity: formData.carryCapacity,
		};

		const toastId = toast.loading(CharToastMessage.loading);
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
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setMiscMetrics(body);
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Miscs"
			memoryId={`${characterId}-MiscMetrics`}>
			<HookedForm.Form
				form={formMisc}
				onChangeAction={onMiscFormChange}
				style={{ display: "flex" }}>
				<UIBasics.Table
					tableData={{
						tableLanes: [formTableEntry("Carga Máxima", "carryCapacity")],
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
			<HookedForm.Form
				form={formCore}
				onChangeAction={onCoreFormChange}
				style={{ display: "flex" }}>
				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry("Iniciativa", "initiative"),
							formTableEntry("C.A.", "armorClass"),
							formTableEntry("Mov. de Andar", "walkSpeed"),
							formTableEntry("Mov. de Combate", "combatSpeed"),
							formTableEntry("Mov. de Nado", "swimSpeed"),
							formTableEntry("Mov. de Voo", "flySpeed"),
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
