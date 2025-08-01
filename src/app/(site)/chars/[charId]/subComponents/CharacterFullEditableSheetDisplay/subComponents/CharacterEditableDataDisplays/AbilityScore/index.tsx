import { StyledLink } from "@/components/(Design)";
import { NotionTable, NotionText } from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import {
	AbilityScoreContext,
	CharacterIdContext,
} from "../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";
import { bonusValueText } from "@/utils/AlbinaAesthetic";

const schema = z.object({
	strength: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	agility: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	technique: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	constitution: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	intelligence: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	wisdom: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
	charisma: z.coerce.number().min(0, "Mínimo de 0").max(40, "Máximo de 40"),
});
type FormData = z.infer<typeof schema>;

function TableAbilityScoreEntry(
	control: Control<FormData>,
	key: keyof FormData,
	title: string,
	value: number
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
		bonusValueText(abilityScoreBonusValue(value)),
	];
}

export function CharacterAbilityScoreDisplay() {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { abilityScore, setAbilityScore } = useContext(AbilityScoreContext);
	const { characterId } = useContext(CharacterIdContext);

	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: abilityScore,
	});
	const watchedValues = watch();

	async function handleWatchedAction(currentValues: FormData) {
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/ability-score`,
			{
				method: "PUT",
				body: JSON.stringify(currentValues),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (response.ok == false) {
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setAbilityScore({
			...currentValues,
			characterId: abilityScore.characterId,
		});
		setErrorMessage("");
		return true;
	}

	return (
		<HookedForm.Form style={{ display: "flex" }}>
			<HookedForm.WatchedAction<FormData>
				watch={watch}
				isValid={isValid}
				action={handleWatchedAction}
			/>
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
									Number(watchedValues.strength) +
										Number(watchedValues.agility) +
										Number(watchedValues.technique) +
										Number(watchedValues.constitution) +
										Number(watchedValues.intelligence) +
										Number(watchedValues.wisdom) +
										Number(watchedValues.charisma)
								)}
							/>,
							"",
						],
						TableAbilityScoreEntry(
							control,
							"strength",
							"Força",
							watchedValues.strength
						),
						TableAbilityScoreEntry(
							control,
							"agility",
							"Agilidade",
							watchedValues.agility
						),
						TableAbilityScoreEntry(
							control,
							"technique",
							"Técnica",
							watchedValues.technique
						),
						TableAbilityScoreEntry(
							control,
							"constitution",
							"Constituição",
							watchedValues.constitution
						),
						TableAbilityScoreEntry(
							control,
							"intelligence",
							"Inteligência",
							watchedValues.intelligence
						),
						TableAbilityScoreEntry(
							control,
							"wisdom",
							"Sabedoria",
							watchedValues.wisdom
						),
						TableAbilityScoreEntry(
							control,
							"charisma",
							"Carisma",
							watchedValues.charisma
						),
					],
				}}
			/>
			<HookedForm.SimpleMessage
				message={isValid ? errorMessage : "Valor inválido detectado"}
				color="red"
			/>
		</HookedForm.Form>
	);
}
