import { GaugeSelection } from "./GaugeSelection";
import { useContext, useEffect } from "react";
import { CharacterIdContext } from "../../../CharacterEditableSheetContextProviders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { CoreMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../CharacterEditableDataDisplays";

const schema = z.object({
	currentHp: z.coerce.number(),
	temporaryHp: z.coerce.number(),
	currentEp: z.coerce.number(),
	temporaryEp: z.coerce.number(),
	currentMp: z.coerce.number(),
	temporaryMp: z.coerce.number(),
});
type FormData = z.infer<typeof schema>;

export function GaugesTable() {
	const { characterId } = useContext(CharacterIdContext);
	const { coreMetrics, setCoreMetrics } = useContext(CoreMetricsContext);

	const defaultValues = {
		currentHp: coreMetrics.healthPoints.baseCurrent,
		temporaryHp: coreMetrics.healthPoints.temporaryCurrentModifier,
		currentEp: coreMetrics.staminaPoints.baseCurrent,
		temporaryEp: coreMetrics.staminaPoints.temporaryCurrentModifier,
		currentMp: coreMetrics.manaPoints.baseCurrent,
		temporaryMp: coreMetrics.manaPoints.temporaryCurrentModifier,
	};
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues,
	});

	useEffect(() => {
		form.setValue("currentHp", coreMetrics.healthPoints.baseCurrent);
		form.setValue(
			"temporaryHp",
			coreMetrics.healthPoints.temporaryCurrentModifier
		);
		form.setValue("currentEp", coreMetrics.staminaPoints.baseCurrent);
		form.setValue(
			"temporaryEp",
			coreMetrics.staminaPoints.temporaryCurrentModifier
		);
		form.setValue("currentMp", coreMetrics.manaPoints.baseCurrent);
		form.setValue(
			"temporaryMp",
			coreMetrics.manaPoints.temporaryCurrentModifier
		);
	}, [coreMetrics]);

	async function onFormChange(formData: FormData): Promise<boolean> {
		if (
			formData.currentHp >
				coreMetrics.healthPoints.baseMax +
					coreMetrics.healthPoints.temporaryCurrentModifier ||
			formData.currentEp >
				coreMetrics.staminaPoints.baseMax +
					coreMetrics.staminaPoints.temporaryCurrentModifier ||
			formData.currentMp >
				coreMetrics.manaPoints.baseMax +
					coreMetrics.manaPoints.temporaryCurrentModifier
		)
			return false;
		const body: CharacterCoreMetrics = {
			...coreMetrics,
			healthPoints: {
				...coreMetrics.healthPoints,
				baseCurrent: formData.currentHp,
				temporaryCurrentModifier: formData.temporaryHp,
			},
			staminaPoints: {
				...coreMetrics.staminaPoints,
				baseCurrent: formData.currentEp,
				temporaryCurrentModifier: formData.temporaryEp,
			},
			manaPoints: {
				...coreMetrics.manaPoints,
				baseCurrent: formData.currentMp,
				temporaryCurrentModifier: formData.temporaryMp,
			},
		};

		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/core-metrics`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return false;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setCoreMetrics(body);
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			style={{ display: "flex" }}
			onChangeAction={onFormChange}>
			<UIBasics.Table
				fixedLinePositions={[1, 3, 4, 5]}
				fixedLineWidths={[20, 5, 10, 5]}
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textColor="red"
								children="HP"
							/>,
							<GaugeSelection
								gauge="Hp"
								color="red"
								currentMax={coreMetrics.healthPoints.effectiveMax}
							/>,
						],
						[
							<UIBasics.Text
								textColor="green"
								children="EP"
							/>,
							<GaugeSelection
								gauge="Ep"
								color="green"
								currentMax={coreMetrics.staminaPoints.effectiveMax}
							/>,
						],
						[
							<UIBasics.Text
								textColor="blue"
								children="MP"
							/>,
							<GaugeSelection
								gauge="Mp"
								color="blue"
								currentMax={coreMetrics.manaPoints.effectiveMax}
							/>,
						],
					],
				}}
			/>
		</HookedForm.Form>
	);
}
