import { StyledLink } from "@/components/(Design)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
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
function tableParameterEntry(
	key: keyof FormData,
	grade: number,
	title: string,
) {
	return [
		<StyledLink
			title={title}
			href={"/"}
			icon={getAlbinaApiFullAddress(`/favicon/default/misc/parameters/${key}`)}
		/>,
		<HookedForm.NumberInputInline
			fieldName={key}
			max={40}
			min={0}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			children={getParameterGradeSymbol(grade)}
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
		form.reset(parameters);
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
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			onChangeAction={handleWatchedAction}
			style={{ display: "flex" }}>
			<UIBasics.Table
				fixedLinePositions={[1, 3]}
				fixedLineWidths={[50, 12]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<UIBasics.Text
								textColor="gray"
								children={"Total"}
							/>,
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
							"",
						],
						tableParameterEntry(
							"vitality",
							race.parameters.vitality,
							"Vitalidade",
						),
						tableParameterEntry("vigor", race.parameters.vigor, "Vigor"),
						tableParameterEntry("mana", race.parameters.manapool, "Manapool"),
						tableParameterEntry(
							"physicalMight",
							race.parameters.physicalPower,
							"P. Física",
						),
						tableParameterEntry(
							"arcanePower",
							race.parameters.magicalPower,
							"P. Mágica",
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
