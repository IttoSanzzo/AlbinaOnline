import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { CharacterActionsPool } from "@/libs/stp@types";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";

const schema = z.object({
	normalActions: z.coerce.number().min(0, "Mínimo de 0"),
	bonusActions: z.coerce.number().min(0, "Mínimo de 0"),
	reactions: z.coerce.number().min(0, "Mínimo de 0"),
	cunningActions: z.coerce.number().min(0, "Mínimo de 0"),
	magicActions: z.coerce.number().min(0, "Mínimo de 0"),
	specialActions: z.coerce.number().min(0, "Mínimo de 0"),
});
type FormData = z.infer<typeof schema>;

function formTableEntry(
	control: Control<FormData>,
	title: string,
	fieldName: keyof FormData
) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<HookedForm.NumberInputInline
			control={control}
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

	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { ...actionPoolState },
	});

	async function onFormChange(formData: FormData) {
		const body = {
			...formData,
		};
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
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setActionsPoolState((state) => ({
			characterId: state.characterId,
			...body,
		}));
		setErrorMessage("");
		return true;
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Ações / Turno"
			memoryId={`${characterId}-ActionsPool`}>
			<HookedForm.Form style={{ display: "flex" }}>
				<HookedForm.WatchedAction<FormData>
					watch={watch}
					isValid={isValid}
					action={onFormChange}
				/>
				<UIBasics.Table
					tableData={{
						tableLanes: [
							formTableEntry(control, "Normais", "normalActions"),
							formTableEntry(control, "Bônus", "bonusActions"),
							formTableEntry(control, "Reações", "reactions"),
							formTableEntry(control, "Ardilosas", "cunningActions"),
							formTableEntry(control, "Mágicas", "magicActions"),
							formTableEntry(control, "Especiais", "specialActions"),
						],
					}}
				/>
				<HookedForm.SimpleMessage
					message={isValid ? errorMessage : "Valor inválido detectado"}
					color="red"
				/>
			</HookedForm.Form>
		</UIBasics.ToggleHeader>
	);
}
