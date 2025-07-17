import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
} from "@/components/(NotionBased)";
import { CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { CommonSpellDomainTablePair } from ".";
import { HookedForm } from "@/libs/stp@forms";
import { z } from "zod";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

function FormSpellDomainTablePair(
	register: UseFormRegister<{
		general: number;
		impetum: number;
		khranitel: number;
		vitaeregio: number;
		migaku: number;
		affaiblir: number;
		aufbringen: number;
		gaizao: number;
		idaitera: number;
		gollemhag: number;
		verstand: number;
		sajak: number;
		anagnosi: number;
	}>,
	name: string
) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<input
			type="number"
			// field={register(
			{...register(
				lowercaseName as
					| "general"
					| "impetum"
					| "khranitel"
					| "vitaeregio"
					| "migaku"
					| "affaiblir"
					| "aufbringen"
					| "gaizao"
					| "idaitera"
					| "gollemhag"
					| "verstand"
					| "sajak"
					| "anagnosi"
			)}
			// label={lowercaseName}
		/>,
	];
}

interface UpdateFormProps {
	spellDomains: CharacterSpellDomains;
	setSpellDomains: (spellDomains: CharacterSpellDomains) => void;
}
export function UpdateForm({ spellDomains, setSpellDomains }: UpdateFormProps) {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, isValid, isDirty },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: spellDomains,
	});

	async function onSubmit(formData: FormData) {
		setSpellDomains({
			characterId: spellDomains.characterId,
			general: formData.general,
			affaiblir: formData.affaiblir,
			anagnosi: formData.anagnosi,
			aufbringen: formData.aufbringen,
			gaizao: formData.gaizao,
			gollemhag: formData.gollemhag,
			idaitera: formData.idaitera,
			impetum: formData.impetum,
			khranitel: formData.khranitel,
			migaku: formData.migaku,
			sajak: formData.sajak,
			verstand: formData.verstand,
			vitaeregio: formData.vitaeregio,
		});
		reset(formData);
	}

	return (
		<HookedForm.Form onSubmit={handleSubmit(onSubmit)}>
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
						withoutBorder>
						<NotionTable
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair(register, "Impetum"),
									FormSpellDomainTablePair(register, "Khranitel"),
									FormSpellDomainTablePair(register, "Aufbringen"),
									FormSpellDomainTablePair(register, "Migaku"),
									FormSpellDomainTablePair(register, "Affaiblir"),
									FormSpellDomainTablePair(register, "Vitaeregio"),
								],
							}}
						/>
					</NotionBox>
				}
				colum2={
					<NotionBox
						backgroundColor="purple"
						withoutBorder>
						<NotionTable
							textColor="pink"
							tableData={{
								tableLanes: [
									FormSpellDomainTablePair(register, "Gaizào"),
									FormSpellDomainTablePair(register, "Verstand"),
									FormSpellDomainTablePair(register, "Sajak"),
									FormSpellDomainTablePair(register, "Idaítera"),
									FormSpellDomainTablePair(register, "Gollemhag"),
									FormSpellDomainTablePair(register, "Anagnosi"),
								],
							}}
						/>
					</NotionBox>
				}
			/>
			{isDirty && (
				<HookedForm.SubmitButton
					disabled={!isValid || isSubmitting}
					color={isValid ? "teal" : "gray"}
					label={
						isValid ? "Salvar Domínios" : "Valores devem estar entre -1 e 10"
					}
				/>
			)}
		</HookedForm.Form>
	);
}
