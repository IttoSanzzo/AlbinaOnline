import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
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
	swimSpeed: z.coerce.number().min(-1, "Mínimo de -1"),
	flySpeed: z.coerce.number().min(-1, "Mínimo de -1"),
	climbSpeed: z.coerce.number().min(-1, "Mínimo de -1"),
	burrowSpeed: z.coerce.number().min(-1, "Mínimo de -1"),
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
	fieldName: keyof FormDataCore | keyof FormDataMisc,
	optional: boolean | undefined = false,
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInput
			inline
			fieldName={fieldName}
			min={optional ? -1 : 0}
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
			walkSpeed: coreMetrics.speedStats.walk,
			combatSpeed: coreMetrics.speedStats.combat,
			swimSpeed: coreMetrics.speedStats.swim ?? -1,
			flySpeed: coreMetrics.speedStats.fly ?? -1,
			climbSpeed: coreMetrics.speedStats.climb ?? -1,
			burrowSpeed: coreMetrics.speedStats.burrow ?? -1,
			armorClass: coreMetrics.armorClass,
			initiative: coreMetrics.initiative,
		},
	});
	useEffect(() => {
		if (!formCore.formState.isDirty)
			formCore.reset({
				walkSpeed: coreMetrics.speedStats.walk,
				combatSpeed: coreMetrics.speedStats.combat,
				swimSpeed: coreMetrics.speedStats.swim ?? -1,
				flySpeed: coreMetrics.speedStats.fly ?? -1,
				climbSpeed: coreMetrics.speedStats.climb ?? -1,
				burrowSpeed: coreMetrics.speedStats.burrow ?? -1,
				armorClass: coreMetrics.armorClass,
				initiative: coreMetrics.initiative,
			});
	}, [coreMetrics]);

	const formMisc = useForm<FormDataMisc>({
		resolver: zodResolver(schemaMisc),
		defaultValues: {
			carryCapacity: miscMetrics.carryCapacity,
		},
	});

	useEffect(() => {
		if (!formMisc.formState.isDirty)
			formMisc.reset({
				carryCapacity: miscMetrics.carryCapacity,
			});
	}, [miscMetrics]);

	async function onCoreFormChange(formData: FormDataCore) {
		const body: CharacterCoreMetrics = {
			...coreMetrics,
			speedStats: {
				walk: formData.walkSpeed,
				combat: formData.combatSpeed,
				swim: formData.swimSpeed > -1 ? formData.swimSpeed : undefined,
				fly: formData.flySpeed > -1 ? formData.flySpeed : undefined,
				climb: formData.climbSpeed > -1 ? formData.climbSpeed : undefined,
				burrow: formData.burrowSpeed > -1 ? formData.burrowSpeed : undefined,
			},
			armorClass: formData.armorClass,
			initiative: formData.initiative,
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
			},
		);
		if (response.ok == false) {
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setCoreMetrics(body);
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		formCore.reset({
			walkSpeed: formData.walkSpeed,
			combatSpeed: formData.combatSpeed,
			swimSpeed: formData.swimSpeed ?? -1,
			flySpeed: formData.flySpeed ?? -1,
			climbSpeed: formData.climbSpeed ?? -1,
			burrowSpeed: formData.burrowSpeed ?? -1,
			armorClass: formData.armorClass,
			initiative: formData.initiative,
		});
		return true;
	}
	async function onMiscFormChange(formData: FormDataMisc) {
		const body: CharacterMiscMetrics = {
			...miscMetrics,
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
			},
		);
		if (response.ok == false) {
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setMiscMetrics(body);
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		formMisc.reset({
			carryCapacity: formData.carryCapacity,
		});
		return true;
	}

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin
			withoutBorder
			withoutBorderRadius
			style={{ borderTopRightRadius: "var(--rd-md)", padding: "5px" }}>
			<UIBasics.Header
				children="Miscs"
				textAlign="center"
				headerType="h2"
				textColor="yellow"
			/>
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
							formTableEntry("Mov. de Nado", "swimSpeed", true),
							formTableEntry("Mov. de Voo", "flySpeed", true),
							formTableEntry("Mov. de Escalada", "climbSpeed", true),
							formTableEntry("Mov. de Cavar", "burrowSpeed", true),
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
		</UIBasics.Box>
	);
}
