import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import z from "zod";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { CharToastMessage } from "..";
import toast from "react-hot-toast";
import React from "react";

const schema = z
	.object({
		baseCurrent: z.coerce.number(),
		baseMax: z.coerce.number().min(0, "Mínimo de 0"),
		temporaryCurrentModifier: z.coerce.number(),
		temporaryMaxModifier: z.coerce.number(),
	})
	.superRefine((formData, ctx) => {
		const effectiveMax = formData.baseMax + formData.temporaryMaxModifier;
		if (formData.baseCurrent > effectiveMax) {
			ctx.addIssue({
				code: z.ZodIssueCode.too_big,
				maximum: effectiveMax,
				type: "number",
				inclusive: true,
				message: "baseCurrent must be equal to or less than effectiveMax",
			});
		}
	});
type FormData = z.infer<typeof schema>;

function formTableEntry(
	title: string,
	fieldName: keyof FormData,
	color: keyof typeof StandartTextColor,
	min?: number,
	max?: number
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInputInline
			fieldName={fieldName}
			color={color}
			min={min}
			max={max}
		/>,
	];
}

interface CharacterGaugeEditableDisplayProps {
	gauge: "healthPoints" | "staminaPoints" | "manaPoints";
	name: string;
	acronym: string;
	color: keyof typeof StandartTextColor;
}
export function CharacterGaugeEditableDisplay({
	gauge,
	name,
	acronym,
	color,
}: CharacterGaugeEditableDisplayProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);
	const { coreMetrics, setCoreMetrics } = useContext(CoreMetricsContext);

	const defaultValues = {
		baseCurrent: coreMetrics[gauge].baseCurrent,
		baseMax: coreMetrics[gauge].baseMax,
		temporaryCurrentModifier: coreMetrics[gauge].temporaryCurrentModifier,
		temporaryMaxModifier: coreMetrics[gauge].temporaryMaxModifier,
	};
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues,
	});
	const watchedValues = form.watch();

	useEffect(() => {
		form.setValue("baseCurrent", coreMetrics[gauge].baseCurrent);
		form.setValue("baseMax", coreMetrics[gauge].baseMax);
		form.setValue(
			"temporaryCurrentModifier",
			coreMetrics[gauge].temporaryCurrentModifier
		);
		form.setValue(
			"temporaryMaxModifier",
			coreMetrics[gauge].temporaryMaxModifier
		);
	}, [coreMetrics]);

	async function onFormChange(formData: FormData) {
		const body: CharacterCoreMetrics = {
			...coreMetrics,
			characterId: characterId,
			[gauge]: {
				baseCurrent: formData.baseCurrent,
				baseMax: formData.baseMax,
				temporaryCurrentModifier: formData.temporaryCurrentModifier,
				temporaryMaxModifier: formData.temporaryMaxModifier,
				effectiveCurrent:
					formData.baseCurrent + formData.temporaryCurrentModifier,
				effectiveMax: formData.baseMax + formData.temporaryMaxModifier,
			},
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
		toast.success("Salvo", { id: toastId });
		return true;
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title={name}
			memoryId={`${characterId}-${acronym}`}>
			<HookedForm.Form
				form={form}
				onChangeAction={onFormChange}
				actionDebounceMs={1000}
				style={{ display: "flex" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}>
					<UIBasics.Table
						tableData={{
							tableLanes: [
								formTableEntry(
									`${acronym} Atual`,
									"baseCurrent",
									color,
									undefined,
									Number(
										watchedValues.baseMax + watchedValues.temporaryMaxModifier
									)
								),
								formTableEntry(
									`${acronym} Temp.`,
									"temporaryCurrentModifier",
									color
								),
								formTableEntry(`${acronym} Max`, "baseMax", color),
								formTableEntry(
									`${acronym} Max Temp.`,
									"temporaryMaxModifier",
									color
								),
							],
						}}
					/>
					<HookedForm.SimpleMessage
						message={
							form.formState.isValid ? errorMessage : "Valor inválido detectado"
						}
						color="red"
					/>
				</div>
			</HookedForm.Form>
		</UIBasics.ToggleHeader>
	);
}
