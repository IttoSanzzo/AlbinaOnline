import { HookedForm } from "@/libs/stp@forms";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React from "react";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";

const schema = z.object({
	backstory: z.string().max(5000, "Máximo de 5000 caracteres"),
});
type FormData = z.infer<typeof schema>;

interface CharacterBackstoryDisplayProps {
	characterBackstory: string;
}
export function CharacterBackstoryDisplay({
	characterBackstory,
}: CharacterBackstoryDisplayProps) {
	const { characterId } = useContext(CharacterIdContext);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			backstory: characterBackstory,
		},
	});

	async function handleWatchedAction(currentValues: FormData) {
		const body = {
			history: currentValues.backstory,
		};
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/backstory`,
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
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<HookedForm.TextAreaInput
					control={control}
					fieldName="backstory"
					label="História"
					labelBackground="gray"
					height={300}
				/>
			</UIBasics.Box>
			<HookedForm.SimpleMessage
				message={isValid ? errorMessage : "Valor inválido detectado"}
				color="red"
			/>
		</HookedForm.Form>
	);
}
