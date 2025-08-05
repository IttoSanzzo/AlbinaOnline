import {
	NotionBox,
	NotionHeader,
	NotionTable,
} from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../../../CharacterEditableSheetContextProviders";
import z from "zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { VarisCoins } from "@/libs/stp@types";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";

const schema = z.object({
	varis: z.coerce.number().min(0, "Mínimo de 0"),
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

interface VarisCoinsControllerProps {
	varisCoins: VarisCoins;
}
export function VarisCoinsController({
	varisCoins,
}: VarisCoinsControllerProps) {
	const [errorMessage, setErrorMessage] = useState<string>("");
	const { characterId } = useContext(CharacterIdContext);

	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		// defaultValues: varisCoins,
		defaultValues: { varis: 0 },
	});
	const watchedValues = watch();

	async function handleWatchedAction(currentValues: FormData) {
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
			setErrorMessage("Erro durante o salvamento");
			return false;
		}
		setErrorMessage("");
		return true;
	}

	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding
			withoutBorder
			withoutMargin>
			<NotionHeader
				headerType="h2"
				textAlign="center"
				textColor="orange"
				children={"Varis"}
			/>
			<HookedForm.Form style={{ display: "flex" }}>
				<HookedForm.WatchedAction<FormData>
					watch={watch}
					isValid={isValid}
					action={handleWatchedAction}
				/>
				<NotionTable
					fixedLinePositions={[1, 3]}
					fixedLineWidths={[50, 12]}
					direction="row"
					tableData={{
						tableLanes: [tableParameterEntry(control, "varis", "Total")],
					}}
				/>
				<HookedForm.SimpleMessage
					message={isValid ? errorMessage : "Valor inválido detectado"}
					color="red"
				/>
			</HookedForm.Form>
		</NotionBox>
	);
}
