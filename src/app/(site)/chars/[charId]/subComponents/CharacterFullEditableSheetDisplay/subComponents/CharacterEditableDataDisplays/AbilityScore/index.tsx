import { StyledLink } from "@/components/(Design)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
	AbilityScoreContext,
	CharacterIdContext,
} from "../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { abilityScoreBonusValue } from "@/utils/AlbinaMath";
import { bonusColor, bonusValueText } from "@/utils/AlbinaAesthetic";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

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

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: abilityScore,
	});
	const watchedValues = form.watch();

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
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
			toast.error(CharToastMessage.error, { id: toastId });
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setAbilityScore({
			...currentValues,
			characterId: abilityScore.characterId,
		});
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
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
						TableAbilityScoreEntry("strength", "Força", watchedValues.strength),
						TableAbilityScoreEntry(
							"agility",
							"Agilidade",
							watchedValues.agility
						),
						TableAbilityScoreEntry(
							"technique",
							"Técnica",
							watchedValues.technique
						),
						TableAbilityScoreEntry(
							"constitution",
							"Constituição",
							watchedValues.constitution
						),
						TableAbilityScoreEntry(
							"intelligence",
							"Inteligência",
							watchedValues.intelligence
						),
						TableAbilityScoreEntry("wisdom", "Sabedoria", watchedValues.wisdom),
						TableAbilityScoreEntry(
							"charisma",
							"Carisma",
							watchedValues.charisma
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
