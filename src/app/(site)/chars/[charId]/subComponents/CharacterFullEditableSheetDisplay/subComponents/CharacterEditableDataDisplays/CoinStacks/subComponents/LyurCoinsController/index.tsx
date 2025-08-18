import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { LyurCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../..";

const schema = z.object({
	lyur: z.coerce.number().min(0, "Mínimo de 0"),
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

interface LyurCoinsControllerProps {
	lyurCoins: LyurCoins;
}
export function LyurCoinsController({ lyurCoins }: LyurCoinsControllerProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: lyurCoins,
	});

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/money/Lyur`,
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
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding
			withoutBorder
			withoutMargin>
			<UIBasics.Header
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"Lyur"}
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
						tableLanes: [tableParameterEntry("lyur", "Total")],
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
