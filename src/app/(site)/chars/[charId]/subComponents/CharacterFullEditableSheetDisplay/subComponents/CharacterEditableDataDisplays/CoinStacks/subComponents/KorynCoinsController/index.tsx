import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { KorynCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { UIBasics } from "@/components/(UIBasics)";
import { CharToastMessage } from "../../..";
import toast from "react-hot-toast";

const schema = z.object({
	copperSmall: z.coerce.number().min(0, "Mínimo de 0"),
	copperLarge: z.coerce.number().min(0, "Mínimo de 0"),
	silverSmall: z.coerce.number().min(0, "Mínimo de 0"),
	silverLarge: z.coerce.number().min(0, "Mínimo de 0"),
	goldSmall: z.coerce.number().min(0, "Mínimo de 0"),
	goldLarge: z.coerce.number().min(0, "Mínimo de 0"),
	platinum: z.coerce.number().min(0, "Mínimo de 0"),
	iridium: z.coerce.number().min(0, "Mínimo de 0"),
	obsidian: z.coerce.number().min(0, "Mínimo de 0"),
	emerald: z.coerce.number().min(0, "Mínimo de 0"),
	diamond: z.coerce.number().min(0, "Mínimo de 0"),
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

interface KorynCoinsControllerProps {
	korynCoins: KorynCoins;
}
export function KorynCoinsController({
	korynCoins,
}: KorynCoinsControllerProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: korynCoins,
	});

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/money/Koryn`,
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
				children={"Koryn"}
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
						tableLanes: [
							tableParameterEntry("copperSmall", "Cobre P."),
							tableParameterEntry("copperLarge", "Cobre G."),
							tableParameterEntry("silverSmall", "Prata P."),
							tableParameterEntry("silverLarge", "Prata G."),
							tableParameterEntry("goldSmall", "Ouro P."),
							tableParameterEntry("goldLarge", "Ouro G."),
							tableParameterEntry("platinum", "Platina"),
							tableParameterEntry("iridium", "Irídio"),
							tableParameterEntry("obsidian", "Obsidiana"),
							tableParameterEntry("emerald", "Esmeralda"),
							tableParameterEntry("diamond", "Diamante"),
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
		</UIBasics.Box>
	);
}
