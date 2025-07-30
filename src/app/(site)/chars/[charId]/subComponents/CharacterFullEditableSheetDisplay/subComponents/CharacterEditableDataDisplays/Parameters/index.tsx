import { StyledLink } from "@/components/(Design)";
import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useRef, useState } from "react";
import { Control, useForm } from "react-hook-form";
import {
	ParametersContext,
	CharacterIdContext,
	RaceContext,
} from "../../CharacterEditableSheetContextProviders";
import z from "zod";
import { shallowCompare } from "@/utils/Data";
import { authenticatedFetchAsync } from "@/utils/FetchTools";

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
		case 1:
			return "🔻";
		case 2:
			return "🔸";
		case 3:
			return "🔺";
	}
	return "?";
}
function tableParameterEntry(
	control: Control<FormData>,
	key: keyof FormData,
	grade: number,
	title: string
) {
	return [
		<StyledLink
			title={title}
			href={"/"}
			// icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			control={control}
			fieldName={key}
			max={40}
			min={0}
		/>,
		<NotionText
			textAlign="center"
			display="block"
			children={getParameterGradeSymbol(grade)}
		/>,
	];
}

export function CharacterParametersDisplay() {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { parameters, setParameters } = useContext(ParametersContext);
	const { characterId } = useContext(CharacterIdContext);
	const { race } = useContext(RaceContext);

	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: parameters,
	});
	const watchedValues = watch();
	const lastValues = useRef({ ...watchedValues });

	useEffect(() => {
		if (isValid && !shallowCompare(lastValues.current, watchedValues)) {
			const timeout = setTimeout(async () => {
				const response = await authenticatedFetchAsync(
					`/chars/${characterId}/parameters`,
					{
						method: "PUT",
						body: JSON.stringify(watchedValues),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				if (response.ok == false) {
					setErrorMessage("Erro durante o salvamento");
					return;
				}
				lastValues.current = { ...watchedValues };
				setParameters({
					...watchedValues,
					characterId: parameters.characterId,
				});
				setErrorMessage("");
			}, 1000);
			return () => clearTimeout(timeout);
		}
	}, [setParameters, watchedValues, isValid]);

	return (
		<>
			<NotionTable
				fixedLinePositions={[1, 3]}
				fixedLineWidths={[50, 12]}
				direction="row"
				withHeaderRow
				tableData={{
					tableLanes: [
						[
							<NotionText
								textColor="gray"
								children={"Total"}
							/>,
							<NotionText
								display="block"
								textAlign="center"
								textColor="gray"
								children={String(
									Number(watchedValues.vitality) +
										Number(watchedValues.vigor) +
										Number(watchedValues.mana) +
										Number(watchedValues.physicalMight) +
										Number(watchedValues.arcanePower)
								)}
							/>,
							"",
						],
						tableParameterEntry(
							control,
							"vitality",
							race.parameters.vitality,
							"Vitalidade"
						),
						tableParameterEntry(
							control,
							"vigor",
							race.parameters.vigor,
							"Vigor"
						),
						tableParameterEntry(
							control,
							"mana",
							race.parameters.manapool,
							"Manapool"
						),
						tableParameterEntry(
							control,
							"physicalMight",
							race.parameters.physicalPower,
							"Poder Físico"
						),
						tableParameterEntry(
							control,
							"arcanePower",
							race.parameters.magicalPower,
							"Poder Mágico"
						),
					],
				}}
			/>
			<HookedForm.SimpleMessage
				message={isValid ? errorMessage : "Valor inválido detectado"}
				color="red"
			/>
		</>
	);
}
