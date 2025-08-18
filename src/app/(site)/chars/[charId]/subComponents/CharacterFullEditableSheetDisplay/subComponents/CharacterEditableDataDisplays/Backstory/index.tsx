import { HookedForm } from "@/libs/stp@forms";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React from "react";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";
import { CharToastMessage } from "..";
import toast from "react-hot-toast";

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
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			backstory: characterBackstory,
		},
	});

	async function handleWatchedAction(currentValues: FormData) {
		const body = {
			history: currentValues.backstory,
		};

		const toastId = toast.loading(CharToastMessage.loading);
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
			actionDebounceMs={3000}>
			<UIBasics.Box
				backgroundColor="gray"
				withoutBorder
				withoutMargin>
				<HookedForm.TextAreaInput
					fieldName="backstory"
					label="História"
					labelBackground="gray"
					height={300}
				/>
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
