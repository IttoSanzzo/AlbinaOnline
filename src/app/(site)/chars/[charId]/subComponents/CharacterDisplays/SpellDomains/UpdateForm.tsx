import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
} from "@/components/(NotionBased)";
import { CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { CommonSpellDomainTablePair } from ".";
import { HookedForm } from "@/libs/stp@forms";
import { z } from "zod";
import { Control, useForm, UseFormRegister } from "react-hook-form";
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
	control: Control<
		{
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
		},
		any,
		{
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
		}
	>,
	name: string
) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={`${getAlbinaApiAddress()}/favicon/spells/${lowercaseName}`}
		/>,
		<HookedForm.NumberInputInline
			control={control}
			fieldName={
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
			}
			max={10}
			min={-1}
		/>,
	];
}

interface UpdateFormProps {
	spellDomains: CharacterSpellDomains;
	setSpellDomains: (spellDomains: CharacterSpellDomains) => void;
}
export function UpdateForm({ spellDomains, setSpellDomains }: UpdateFormProps) {
	const {
		control,
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
						withoutBorder>
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
