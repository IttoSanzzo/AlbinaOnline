import { StyledLink } from "@/components/(Design)";
import { HookedForm } from "@/libs/stp@forms";
import { CharacterSpellDomains, SpellDomain } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import z from "zod";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

const schema = z.object({
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

function FormSpellDomainTablePair(name: string) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiFullAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			fieldName={lowercaseName as keyof FormData}
			max={10}
			min={-1}
		/>,
	];
}

export function CommonSpellDomainTablePair(name: string, level: number) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiFullAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<UIBasics.Text
			textAlign="center"
			display="block"
			children={`${level}`}
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

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: spellDomains,
	});
	useEffect(() => {
		if (!form.formState.isDirty) form.reset(spellDomains);
	}, [spellDomains]);

	const domains = Object.keys(SpellDomain)
		.filter((key) => Number.isNaN(Number(key)) && key != "Unknown")
		.map((key) => key.toLowerCase());
	const generalLevel: number = Math.max(
		-1,
		Math.min(
			4,
			Math.floor(
				Object.entries(form.watch())
					.filter((domain) => domains.includes(domain[0]))
					.map((domain) => domain[1] as number)
					.sort((a, b) => b - a)
					.slice(0, 4)
					.reduce((acc, value) => acc + value, 0) / 6,
			),
		),
	);

	async function handleWatchedAction(currentValues: FormData) {
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			`/chars/${characterId}/spell-domains`,
			{
				method: "PUT",
				body: JSON.stringify(currentValues),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (response.ok == false) {
			setErrorMessage("Erro durante o salvamento");
			toast.error(CharToastMessage.error, { id: toastId });
			return false;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setErrorMessage("");
		form.reset(currentValues);
		return true;
	}

	return (
		<HookedForm.Form
			form={form}
			onChangeAction={handleWatchedAction}>
			<UIBasics.Box
				backgroundColor="purple"
				withoutBorder
				withoutMargin
				style={{ paddingBottom: 0 }}>
				<UIBasics.Table
					textColor="pink"
					tableData={{
						tableLanes: [CommonSpellDomainTablePair("General", generalLevel)],
					}}
				/>
			</UIBasics.Box>
			<UIBasics.MultiColumn.Two
				colum1={
					<UIBasics.Box
						backgroundColor="purple"
						withoutBorder
						withoutMargin>
						<UIBasics.Table
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair("Impetum"),
									FormSpellDomainTablePair("Khranitel"),
									FormSpellDomainTablePair("Aufbringen"),
									FormSpellDomainTablePair("Migaku"),
									FormSpellDomainTablePair("Affaiblir"),
									FormSpellDomainTablePair("Vitaeregio"),
								],
							}}
						/>
					</UIBasics.Box>
				}
				colum2={
					<UIBasics.Box
						backgroundColor="purple"
						withoutBorder
						withoutMargin>
						<UIBasics.Table
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair("Gaizào"),
									FormSpellDomainTablePair("Verstand"),
									FormSpellDomainTablePair("Sajak"),
									FormSpellDomainTablePair("Idaítera"),
									FormSpellDomainTablePair("Gollemhag"),
									FormSpellDomainTablePair("Anagnosi"),
								],
							}}
						/>
					</UIBasics.Box>
				}
			/>
			<HookedForm.SimpleMessage
				message={
					form.formState.isValid ? errorMessage : "Valor inválido detectado"
				}
				color="red"
			/>
		</HookedForm.Form>
	);
}
