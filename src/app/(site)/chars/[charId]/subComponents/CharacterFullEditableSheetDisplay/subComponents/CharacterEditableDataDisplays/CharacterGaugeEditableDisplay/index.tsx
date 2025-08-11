import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterCoreMetrics } from "@/libs/stp@types";
import z from "zod";
import { CoreMetricsContext } from "../../CharacterEditableSheetContextProviders/contexts/CoreMetrics";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";

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
	control: Control<FormData>,
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
			control={control}
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

	const {
		control,
		watch,
		setValue,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			baseCurrent: coreMetrics[gauge].baseCurrent,
			baseMax: coreMetrics[gauge].baseMax,
			temporaryCurrentModifier: coreMetrics[gauge].temporaryCurrentModifier,
			temporaryMaxModifier: coreMetrics[gauge].temporaryMaxModifier,
		},
	});
	const watchedValues = watch();

	useEffect(() => {
		setValue("baseCurrent", coreMetrics[gauge].baseCurrent);
		setValue("baseMax", coreMetrics[gauge].baseMax);
		setValue(
			"temporaryCurrentModifier",
			coreMetrics[gauge].temporaryCurrentModifier
		);
		setValue("temporaryMaxModifier", coreMetrics[gauge].temporaryMaxModifier);
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

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title={name}
			memoryId={`${characterId}-${acronym}`}>
			<HookedForm.Form style={{ display: "flex" }}>
				<HookedForm.WatchedAction<FormData>
					watch={watch}
					isValid={isValid}
					action={onFormChange}
				/>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
					}}>
					<UIBasics.Table
						tableData={{
							tableLanes: [
								formTableEntry(
									control,
									`${acronym} Atual`,
									"baseCurrent",
									color,
									undefined,
									Number(
										watchedValues.baseMax + watchedValues.temporaryMaxModifier
									)
								),
								formTableEntry(
									control,
									`${acronym} Temp.`,
									"temporaryCurrentModifier",
									color
								),
								formTableEntry(control, `${acronym} Max`, "baseMax", color),
								formTableEntry(
									control,
									`${acronym} Max Temp.`,
									"temporaryMaxModifier",
									color
								),
							],
						}}
					/>
					<HookedForm.SimpleMessage
						message={isValid ? errorMessage : "Valor inválido detectado"}
						color="red"
					/>
				</div>
			</HookedForm.Form>
		</UIBasics.ToggleHeader>
	);
}
