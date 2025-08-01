import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { HookedForm } from "@/libs/stp@forms";
import { CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { useContext, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React from "react";
import z from "zod";

const schema = z.object({
	general: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	impetum: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	khranitel: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	vitaeregio: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	migaku: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	affaiblir: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	aufbringen: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	gaizao: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	idaitera: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	gollemhag: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	verstand: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	sajak: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
	anagnosi: z.coerce.number().min(-1, "Mínimo de -1").max(10, "Máximo de 10"),
});
type FormData = z.infer<typeof schema>;

function FormSpellDomainTablePair(control: Control<FormData>, name: string) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			control={control}
			fieldName={lowercaseName as keyof FormData}
			max={10}
			min={-1}
		/>,
	];
}

export function CommonSpellDomainTablePair(
	name: string,
	spellDomains: CharacterSpellDomains
) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<NotionText
			textAlign="center"
			display="block"
			children={`${
				spellDomains[
					name === "General"
						? "general"
						: (lowercaseName as keyof CharacterSpellDomains)
				]
			}`}
		/>,
	];
}

interface CharacterSpellDomainsDisplayProps {
	spellDomains: CharacterSpellDomains;
}
export function CharacterSpellDomainsDisplay({
	spellDomains,
}: CharacterSpellDomainsDisplayProps) {
	const { characterId } = useContext(CharacterIdContext);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const {
		control,
		watch,
		formState: { isValid },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: spellDomains,
	});

	async function handleWatchedAction(currentValues: FormData) {
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/spell-domains`,
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
		<HookedForm.Form>
			<HookedForm.WatchedAction
				watch={watch}
				isValid={isValid}
				action={handleWatchedAction}
			/>
			<NotionBox
				backgroundColor="purple"
				withoutBorder
				withoutMargin>
				<NotionTable
					textColor="pink"
					tableData={{
						tableLanes: [CommonSpellDomainTablePair("General", spellDomains)],
					}}
				/>
			</NotionBox>
			<Notion2Columns
				colum1={
					<NotionBox
						backgroundColor="purple"
						withoutBorder
						withoutMargin>
						<NotionTable
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair(control, "Impetum"),
									FormSpellDomainTablePair(control, "Khranitel"),
									FormSpellDomainTablePair(control, "Aufbringen"),
									FormSpellDomainTablePair(control, "Migaku"),
									FormSpellDomainTablePair(control, "Affaiblir"),
									FormSpellDomainTablePair(control, "Vitaeregio"),
								],
							}}
						/>
					</NotionBox>
				}
				colum2={
					<NotionBox
						backgroundColor="purple"
						withoutBorder
						withoutMargin>
						<NotionTable
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair(control, "Gaizào"),
									FormSpellDomainTablePair(control, "Verstand"),
									FormSpellDomainTablePair(control, "Sajak"),
									FormSpellDomainTablePair(control, "Idaítera"),
									FormSpellDomainTablePair(control, "Gollemhag"),
									FormSpellDomainTablePair(control, "Anagnosi"),
								],
							}}
						/>
					</NotionBox>
				}
			/>
			<HookedForm.SimpleMessage
				message={isValid ? errorMessage : "Valor inválido detectado"}
				color="red"
			/>
		</HookedForm.Form>
	);
}
