"use client";

import { StyledLink } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import AllSpellsDisplay from "./subComponents/AllSpellsDisplay";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm } from "@/libs/stp@forms";

const schema = z.object({
	filter: z.string().transform((filter) => filter.toLowerCase()),
});
type FormData = z.infer<typeof schema>;

interface PageContentProps {
	spells: SpellData[];
}
export default function PageContent({ spells }: PageContentProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			filter: "",
		},
	});
	const filter = form.watch().filter.toLowerCase();

	const filteredSpells: SpellData[] =
		filter.length === 0
			? spells
			: spells.filter(
					(spell) =>
						spell.name.toLowerCase().includes(filter) ||
						spell.type.toLowerCase().includes(filter) ||
						spell.subType.toLowerCase().includes(filter) ||
						spell.domainLevel === Number(filter)
			  );

	const DomainInfos = [
		["Affaiblir", "affaiblir"],
		["Anagnosi", "anagnosi"],
		["Aufbringen", "aufbringen"],
		["Gaizao", "gaizao"],
		["Gollemhag", "gollemhag"],
		["Idaitera", "idaitera"],
		["Impetum", "impetum"],
		["Khranitel", "khranitel"],
		["Migaku", "migaku"],
		["Sajak", "sajak"],
		["Verstand", "verstand"],
		["Vitaeregio", "vitaeregio"],
	];

	return (
		<>
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textAlign="center"
					textColor="purple"
					children={"Domínios"}
				/>
				<UIBasics.List.Grid
					backgroundColor="darkGray"
					children={DomainInfos.map((DomainInfo) => (
						<StyledLink
							key={DomainInfo[0]}
							href={`/spells/${DomainInfo[1]}`}
							title={DomainInfo[0]}
							icon={getAlbinaApiFullAddress(`/favicon/spells/${DomainInfo[1]}`)}
						/>
					))}
				/>
			</UIBasics.Box>

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<HookedForm.Form form={form}>
					<HookedForm.TextInput<FormData>
						fieldName="filter"
						label="Filtro"
						labelBackground="darkGray"
					/>
					{filteredSpells.length === 0 && (
						<UIBasics.Header
							textAlign="center"
							textColor="gray"
							children="Nenhum Resultado"
						/>
					)}
				</HookedForm.Form>
				<AllSpellsDisplay allSpells={filteredSpells} />
			</UIBasics.Box>
		</>
	);
}
