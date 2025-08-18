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
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

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
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { ...characterProfile },
	});

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
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
			onChangeAction={handleWatchedAction}>
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<UIBasics.Table
					direction="column"
					columnBackgroundColors={["darkGray", undefined, "darkGray"]}
					tableData={{
						tableLanes: [
							[
								<UIBasics.Text textColor="gray">Idade</UIBasics.Text>,
								<HookedForm.NumberInputInline
									fieldName="age"
									min={0}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Anos
								</UIBasics.Text>,
							],
							[
								<UIBasics.Text textColor="gray">Altura</UIBasics.Text>,
								<HookedForm.NumberInputInline
									fieldName="stature"
									min={0}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Centímetros
								</UIBasics.Text>,
							],
							[
								<UIBasics.Text textColor="gray">Peso</UIBasics.Text>,
								<HookedForm.NumberInputInline
									fieldName="weight"
									min={0}
								/>,
								<UIBasics.Text
									display="block"
									textAlign="center"
									textColor="gray">
									Kgs
								</UIBasics.Text>,
							],
						],
					}}
				/>
				<HookedForm.Space height={5} />
				<UIBasics.MultiColumn.Two
					colum1={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								fieldName="personalityTraces"
								label="Traços de Personalidade"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								fieldName="ideals"
								label="Ideais"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								fieldName="bonds"
								label="Vínculos"
								labelBackground="gray"
							/>
						</TextAreasContainer>
					}
					colum2={
						<TextAreasContainer>
							<HookedForm.TextAreaInput
								fieldName="summary"
								label="Sumário"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								fieldName="appearanceDescription"
								label="Aparência"
								labelBackground="gray"
							/>
							<HookedForm.TextAreaInput
								fieldName="backgroundHistory"
								label="Background"
								labelBackground="gray"
							/>
						</TextAreasContainer>
					}
				/>
				<HookedForm.Space height={5} />
				<HookedForm.Separator />
			</UIBasics.Box>
			<HookedForm.SimpleMessage
				message={
					form.formState.isValid ? errorMessage : "Valor inválido detectado"
				}
				color="red"
			/>
		</HookedForm.Form>
	);
}
