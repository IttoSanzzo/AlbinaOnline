import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { GaugeSelection } from "./GaugeSelection";
import { useContext, useEffect } from "react";
import { CharacterIdContext } from "../../../CharacterEditableSheetContextProviders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { HookedForm } from "@/libs/stp@forms";
import { CoreMetricsContext } from "../../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

const schema = z.object({
	currentHp: z.coerce.number(),
	temporaryHp: z.coerce.number(),
	currentEp: z.coerce.number(),
	temporaryEp: z.coerce.number(),
	currentMp: z.coerce.number(),
	temporaryMp: z.coerce.number(),
});
type FormData = z.infer<typeof schema>;

interface GaugesTableProps {}
export function GaugesTable({}: GaugesTableProps) {
	const { characterId } = useContext(CharacterIdContext);
	const { coreMetrics, setCoreMetrics } = useContext(CoreMetricsContext);

	const {
		control,
		formState: { isValid },
		setValue,
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			currentHp: coreMetrics.healthPoints.baseCurrent,
			temporaryHp: coreMetrics.healthPoints.temporaryCurrentModifier,
			currentEp: coreMetrics.staminaPoints.baseCurrent,
			temporaryEp: coreMetrics.staminaPoints.temporaryCurrentModifier,
			currentMp: coreMetrics.manaPoints.baseCurrent,
			temporaryMp: coreMetrics.manaPoints.temporaryCurrentModifier,
		},
	});

	useEffect(() => {
		setValue("currentHp", coreMetrics.healthPoints.baseCurrent);
		setValue("temporaryHp", coreMetrics.healthPoints.temporaryCurrentModifier);
		setValue("currentEp", coreMetrics.staminaPoints.baseCurrent);
		setValue("temporaryEp", coreMetrics.staminaPoints.temporaryCurrentModifier);
		setValue("currentMp", coreMetrics.manaPoints.baseCurrent);
		setValue("temporaryMp", coreMetrics.manaPoints.temporaryCurrentModifier);
	}, [coreMetrics]);

	async function onFormChange(formData: FormData): Promise<boolean> {
		if (
			formData.currentHp > coreMetrics.healthPoints.effectiveCurrent ||
			formData.currentEp > coreMetrics.staminaPoints.effectiveCurrent ||
			formData.currentMp > coreMetrics.manaPoints.effectiveCurrent
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
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/core-metrics`),
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return false;
		setCoreMetrics(body);
		return true;
	}

	return (
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				action={onFormChange}
			/>
			<NotionTable
				fixedLinePositions={[1, 3, 4, 5]}
				fixedLineWidths={[20, 5, 10, 5]}
				tableData={{
					tableLanes: [
						[
							<NotionText
								textColor="red"
								children="HP"
							/>,
							<GaugeSelection
								control={control}
								gauge="Hp"
								color="red"
								currentMax={coreMetrics.healthPoints.effectiveMax}
							/>,
						],
						[
							<NotionText
								textColor="green"
								children="EP"
							/>,
							<GaugeSelection
								control={control}
								gauge="Ep"
								color="green"
								currentMax={coreMetrics.staminaPoints.effectiveMax}
							/>,
						],
						[
							<NotionText
								textColor="blue"
								children="MP"
							/>,
							<GaugeSelection
								control={control}
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
