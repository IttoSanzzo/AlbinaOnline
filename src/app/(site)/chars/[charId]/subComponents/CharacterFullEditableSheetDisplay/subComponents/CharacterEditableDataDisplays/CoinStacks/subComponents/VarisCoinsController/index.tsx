import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { VarisCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { UIBasics } from "@/components/(UIBasics)";
import { CharToastMessage } from "../../..";
import toast from "react-hot-toast";

const schema = z.object({
	varis: z.coerce.number().min(0, "Mínimo de 0"),
});
type FormData = z.infer<typeof schema>;

function tableParameterEntry(key: keyof FormData, title: string) {
	return [
		<StyledFalseLink
			title={title}
			// icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			fieldName={key}
			min={0}
		/>,
	];
}

interface VarisCoinsControllerProps {
	varisCoins: VarisCoins;
}
export function VarisCoinsController({
	varisCoins,
}: VarisCoinsControllerProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		// defaultValues: varisCoins,
		defaultValues: { varis: varisCoins ?? 0 },
	});

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/money/Varis`,
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
		setErrorMessage("");
		toast.success(CharToastMessage.success, { id: toastId });
		return true;
	}

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding
			withoutBorder
			withoutMargin>
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"Varis"}
			/>
			<HookedForm.Form
				form={form}
				onChangeAction={handleWatchedAction}
				style={{ display: "flex" }}>
				<UIBasics.Table
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [tableParameterEntry("varis", "Total")],
					}}
				/>
				<HookedForm.SimpleMessage
					message={
						form.formState.isValid ? errorMessage : "Valor inválido detectado"
					}
					color="red"
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
