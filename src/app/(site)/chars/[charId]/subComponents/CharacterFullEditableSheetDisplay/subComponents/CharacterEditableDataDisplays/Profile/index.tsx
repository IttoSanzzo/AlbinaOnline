import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React from "react";
import z from "zod";
import { CharacterProfile } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const TextAreasContainer = newStyledElement.div(styles.textAreasContainer);

const schema = z.object({
	age: z.coerce.number().min(0, "Mínimo de 0 anos"),
	stature: z.coerce.number().min(0, "Mínimo de 0 centímetros"),
	weight: z.coerce.number().min(0, "Mínimo de 0 Kgs"),
	appearanceDescription: z.string().max(1000, "Máximo de 1000 caracteres"),
	personalityTraces: z.string().max(1000, "Máximo de 1000 caracteres"),
	ideals: z.string().max(1000, "Máximo de 1000 caracteres"),
	bonds: z.string().max(1000, "Máximo de 1000 caracteres"),
	summary: z.string().max(1000, "Máximo de 1000 caracteres"),
	backgroundHistory: z.string().max(1000, "Máximo de 1000 caracteres"),
});
type FormData = z.infer<typeof schema>;

interface CharacterProfileDisplayProps {
	characterProfile: CharacterProfile;
}
export function CharacterProfileDisplay({
	characterProfile,
}: CharacterProfileDisplayProps) {
	const { characterId } = useContext(CharacterIdContext);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: characterProfile,
	});

	async function handleWatchedAction(currentValues: FormData) {
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/profile`),
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
		setErrorMessage("");
		return true;
	}

	return (
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				isValid={isValid}
				debounce={3000}
				action={handleWatchedAction}
			/>
			<NotionBox
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<NotionTable
					direction="column"
					columnBackgroundColors={["darkGray", undefined, "darkGray"]}
					tableData={{
						tableLanes: [
							[
								<NotionText textColor="gray">Idade</NotionText>,
								<HookedForm.NumberInputInline
									control={control}
									fieldName="age"
									min={0}
								/>,
								<NotionText
									display="block"
									textAlign="center"
									textColor="gray">
									Anos
								</NotionText>,
							],
							[
								<NotionText textColor="gray">Altura</NotionText>,
								<HookedForm.NumberInputInline
									control={control}
									fieldName="stature"
									min={0}
								/>,
								<NotionText
									display="block"
									textAlign="center"
									textColor="gray">
									Centímetros
								</NotionText>,
							],
							[
								<NotionText textColor="gray">Peso</NotionText>,
								<HookedForm.NumberInputInline
									control={control}
									fieldName="weight"
									min={0}
								/>,
								<NotionText
									display="block"
									textAlign="center"
									textColor="gray">
									Kgs
								</NotionText>,
							],
						],
					}}
				/>
				<HookedForm.Space height={5} />
				<Notion2Columns
					colum1={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="personalityTraces"
								label="Traços de Personalidade"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="ideals"
								label="Ideais"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="bonds"
								label="Vínculos"
								labelBackground="gray"
							/>
						</TextAreasContainer>
					}
					colum2={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="summary"
								label="Sumário"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="appearanceDescription"
								label="Aparência"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								control={control}
								fieldName="backgroundHistory"
								label="Background"
								labelBackground="gray"
							/>
						</TextAreasContainer>
					}
				/>
				<HookedForm.Space height={5} />
				<HookedForm.Separator />
			</NotionBox>
			<HookedForm.SimpleMessage
				message={isValid ? errorMessage : "Valor inválido detectado"}
				color="red"
			/>
		</HookedForm.Form>
	);
}
