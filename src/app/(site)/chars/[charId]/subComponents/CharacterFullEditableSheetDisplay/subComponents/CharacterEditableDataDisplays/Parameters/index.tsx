import { StyledLink } from "@/components/(Design)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	ParametersContext,
	CharacterIdContext,
	RaceContext,
} from "../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const schema = z.object({
	vitality: z.coerce.number().min(0, "Mínimo de 0").max(50, "Máximo de 50"),
	vigor: z.coerce.number().min(0, "Mínimo de 0").max(50, "Máximo de 50"),
	mana: z.coerce.number().min(0, "Mínimo de 0").max(50, "Máximo de 50"),
	physicalMight: z.coerce
		.number()
		.min(0, "Mínimo de 0")
		.max(50, "Máximo de 50"),
	arcanePower: z.coerce.number().min(0, "Mínimo de 0").max(50, "Máximo de 50"),
});
type FormData = z.infer<typeof schema>;

function getParameterGradeSymbol(grade: number) {
	switch (grade) {
		case 0:
			return "0";
		case 1:
			return "🔻";
		case 2:
			return "🔹";
		case 3:
			return "🔺";
		case 4:
			return "⚜️";
	}
	return "?";
}
function getParameterGradeTotalLevel(grade: number, points: number) {
	switch (grade) {
		case 0:
			return -1;
		case 1:
			return Math.floor(points / 2);
		case 2:
			return Math.floor(points / 1.5);
		case 3:
			return Math.floor(points / 1.5);
		case 4:
			return points;
	}
	return -1;
}
function tableParameterEntry(
	key: keyof FormData,
	grade: number,
	title: string,
	investedPoints: number,
) {
	const totalLevel = getParameterGradeTotalLevel(grade, investedPoints);
	return [
		<StyledLink
			title={title}
			href={"/"}
			icon={getAlbinaApiFullAddress(`/favicon/default/misc/parameters/${key}`)}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			children={getParameterGradeSymbol(grade)}
		/>,
		<HookedForm.NumberInputInline
			fieldName={key}
			max={totalLevel >= 6 ? investedPoints : 12}
			min={0}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			textColor="orange"
			children={`${totalLevel != 0 ? totalLevel : ""}`}
		/>,
	];
}

export function CharacterParametersDisplay() {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { parameters } = useContext(ParametersContext);
	const { characterId } = useContext(CharacterIdContext);
	const { race } = useContext(RaceContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: parameters,
	});
	useEffect(() => {
		if (!form.formState.isDirty) form.reset(parameters);
	}, [parameters]);
	const watchedValues = form.watch();

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/parameters`,
			{
				method: "PUT",
				body: JSON.stringify(currentValues),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setErrorMessage("");
		form.reset({ ...currentValues });
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			onChangeAction={handleWatchedAction}
			style={{ display: "flex" }}>
			<UIBasics.Table
				fixedLinePositions={[1, 2, 4]}
				fixedLineWidths={[50, 12, 12]}
				columnBackgroundColors={[undefined, "darkGray", undefined, "darkGray"]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textColor="gray"
								children={"Total"}
							/>,
							<Fragment />,
							<UIBasics.Text
								display="block"
								textAlign="center"
								textColor="gray"
								children={String(
									Number(watchedValues.vitality) +
										Number(watchedValues.vigor) +
										Number(watchedValues.mana) +
										Number(watchedValues.physicalMight) +
										Number(watchedValues.arcanePower),
								)}
							/>,
							<Fragment />,
						],
						tableParameterEntry(
							"vitality",
							race.parameters.vitality,
							"Vitalidade",
							watchedValues.vitality,
						),
						tableParameterEntry(
							"vigor",
							race.parameters.vigor,
							"Vigor",
							watchedValues.vigor,
						),
						tableParameterEntry(
							"mana",
							race.parameters.manapool,
							"Manapool",
							watchedValues.mana,
						),
						tableParameterEntry(
							"physicalMight",
							race.parameters.physicalPower,
							"P. Física",
							watchedValues.physicalMight,
						),
						tableParameterEntry(
							"arcanePower",
							race.parameters.magicalPower,
							"P. Mágica",
							watchedValues.arcanePower,
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
		</HookedForm.Form>
	);
}
