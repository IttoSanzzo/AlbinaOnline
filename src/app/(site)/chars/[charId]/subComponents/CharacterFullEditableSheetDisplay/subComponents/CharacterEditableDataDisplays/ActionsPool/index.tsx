import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterActionsPool } from "@/libs/stp@types";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

const schema = z.object({
	normalActions: z.coerce.number().min(0, "Mínimo de 0"),
	bonusActions: z.coerce.number().min(0, "Mínimo de 0"),
	reactions: z.coerce.number().min(0, "Mínimo de 0"),
	cunningActions: z.coerce.number().min(0, "Mínimo de 0"),
	magicActions: z.coerce.number().min(0, "Mínimo de 0"),
	specialActions: z.coerce.number().min(0, "Mínimo de 0"),
});
type FormData = z.infer<typeof schema>;

function formTableEntry(title: string, fieldName: keyof FormData) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInputInline
			min={0}
			fieldName={fieldName}
		/>,
	];
}

interface CharacterActionsPoolDisplayProps {
	characterActionsPool: CharacterActionsPool;
}
export function CharacterActionsPoolDisplay({
	characterActionsPool,
}: CharacterActionsPoolDisplayProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);
	const [actionPoolState, setActionsPoolState] =
		useState<CharacterActionsPool>(characterActionsPool);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { ...actionPoolState },
	});

	async function onFormChange(formData: FormData) {
		const body = {
			...formData,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/action-pool`,
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
		setActionsPoolState((state) => ({
			characterId: state.characterId,
			...body,
		}));
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Ações / Turno"
			memoryId={`${characterId}-ActionsPool`}>
			<HookedForm.Form
				form={form}
				onChangeAction={onFormChange}
				style={{ display: "flex" }}>
				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry("Normais", "normalActions"),
							formTableEntry("Bônus", "bonusActions"),
							formTableEntry("Reações", "reactions"),
							formTableEntry("Ardilosas", "cunningActions"),
							formTableEntry("Mágicas", "magicActions"),
							formTableEntry("Especiais", "specialActions"),
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
		</UIBasics.ToggleHeader>
	);
}
