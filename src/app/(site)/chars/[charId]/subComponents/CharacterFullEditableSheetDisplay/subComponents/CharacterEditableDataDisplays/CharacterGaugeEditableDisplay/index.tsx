import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import z from "zod";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { CharToastMessage } from "..";
import toast from "react-hot-toast";

const schema = z
	.object({
		baseCurrent: z.number(),
		baseMax: z.number().min(0, "Mínimo de 0"),
		temporaryCurrentModifier: z.number(),
		temporaryMaxModifier: z.number(),
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
	max?: number,
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
	style?: CSSProperties;
}
export function CharacterGaugeEditableDisplay({
	gauge,
	name,
	acronym,
	color,
	style,
}: CharacterGaugeEditableDisplayProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);
	const { coreMetrics, setCoreMetrics } = useContext(CoreMetricsContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			baseCurrent: coreMetrics[gauge].baseCurrent,
			baseMax: coreMetrics[gauge].baseMax,
			temporaryCurrentModifier: coreMetrics[gauge].temporaryCurrentModifier,
			temporaryMaxModifier: coreMetrics[gauge].temporaryMaxModifier,
		},
	});
	const watchedValues = form.watch();

	useEffect(() => {
		if (!form.formState.isDirty)
			form.reset({
				baseCurrent: coreMetrics[gauge].baseCurrent,
				baseMax: coreMetrics[gauge].baseMax,
				temporaryCurrentModifier: coreMetrics[gauge].temporaryCurrentModifier,
				temporaryMaxModifier: coreMetrics[gauge].temporaryMaxModifier,
			});
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
			},
		);
		if (response.ok == false) {
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setCoreMetrics(body);
		setErrorMessage("");
		toast.success("Salvo", { id: toastId });
		form.reset({
			baseCurrent: formData.baseCurrent,
			baseMax: formData.baseMax,
			temporaryCurrentModifier: formData.temporaryCurrentModifier,
			temporaryMaxModifier: formData.temporaryMaxModifier,
		});
		return true;
	}

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin
			withoutBorder
			withoutBorderRadius
			style={{ padding: "5px", ...style }}>
			<UIBasics.Header
				children={name}
				textAlign="center"
				headerType="h2"
				textColor="yellow"
			/>
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
									-watchedValues.temporaryMaxModifier,
									watchedValues.baseMax + watchedValues.temporaryMaxModifier,
								),
								formTableEntry(
									`${acronym} Temp.`,
									"temporaryCurrentModifier",
									color,
									-9999,
									9999,
								),
								formTableEntry(`${acronym} Max`, "baseMax", color, 0, 9999),
								formTableEntry(
									`${acronym} Max Temp.`,
									"temporaryMaxModifier",
									color,
									0,
									9999,
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
		</UIBasics.Box>
	);
}
