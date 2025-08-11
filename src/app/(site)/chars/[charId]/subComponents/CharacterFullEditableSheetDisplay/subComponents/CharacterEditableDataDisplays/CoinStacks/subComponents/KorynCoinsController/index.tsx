import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { KorynCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { UIBasics } from "@/components/(UIBasics)";

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

function tableParameterEntry(
	control: Control<FormData>,
	key: keyof FormData,
	title: string
) {
	return [
		<StyledFalseLink
			title={title}
			// icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			control={control}
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

	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: korynCoins,
	});
	const watchedValues = watch();

	async function handleWatchedAction(currentValues: FormData) {
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
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
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
				children={"Koryn"}
			/>
			<HookedForm.Form style={{ display: "flex" }}>
				<HookedForm.WatchedAction<FormData>
					watch={watch}
					isValid={isValid}
					action={handleWatchedAction}
				/>
				<UIBasics.Table
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [
							tableParameterEntry(control, "copperSmall", "Cobre P."),
							tableParameterEntry(control, "copperLarge", "Cobre G."),
							tableParameterEntry(control, "silverSmall", "Prata P."),
							tableParameterEntry(control, "silverLarge", "Prata G."),
							tableParameterEntry(control, "goldSmall", "Ouro P."),
							tableParameterEntry(control, "goldLarge", "Ouro G."),
							tableParameterEntry(control, "platinum", "Platina"),
							tableParameterEntry(control, "iridium", "Irídio"),
							tableParameterEntry(control, "obsidian", "Obsidiana"),
							tableParameterEntry(control, "emerald", "Esmeralda"),
							tableParameterEntry(control, "diamond", "Diamante"),
						],
					}}
				/>
				<HookedForm.SimpleMessage
					message={isValid ? errorMessage : "Valor inválido detectado"}
					color="red"
				/>
			</HookedForm.Form>
		</UIBasics.Box>
	);
}
