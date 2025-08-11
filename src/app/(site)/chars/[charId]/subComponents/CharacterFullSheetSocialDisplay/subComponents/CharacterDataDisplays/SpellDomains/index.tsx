import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import React from "react";

function FormSpellDomainTablePair(name: string, level: number) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={getAlbinaApiAddress(`/favicon/spells/${lowercaseName}`)}
		/>,
		<UIBasics.Text
			display="block"
			textAlign="center"
			children={level.toString()}
		/>,
	];
}

interface CharacterSpellDomainsDisplayProps {
	spellDomains: CharacterSpellDomains;
}
export function CharacterSpellDomainsDisplay({
	spellDomains,
}: CharacterSpellDomainsDisplayProps) {
	return (
		<div>
			<UIBasics.Box
				backgroundColor="purple"
				withoutBorder
				withoutMargin>
				<UIBasics.Table
					textColor="pink"
					tableData={{
						tableLanes: [
							FormSpellDomainTablePair("General", spellDomains.general),
						],
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
									FormSpellDomainTablePair("Impetum", spellDomains.impetum),
									FormSpellDomainTablePair("Khranitel", spellDomains.khranitel),
									FormSpellDomainTablePair(
										"Aufbringen",
										spellDomains.aufbringen
									),
									FormSpellDomainTablePair("Migaku", spellDomains.migaku),
									FormSpellDomainTablePair("Affaiblir", spellDomains.affaiblir),
									FormSpellDomainTablePair(
										"Vitaeregio",
										spellDomains.vitaeregio
									),
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
									FormSpellDomainTablePair("Gaizào", spellDomains.gaizao),
									FormSpellDomainTablePair("Verstand", spellDomains.verstand),
									FormSpellDomainTablePair("Sajak", spellDomains.sajak),
									FormSpellDomainTablePair("Idaítera", spellDomains.idaitera),
									FormSpellDomainTablePair("Gollemhag", spellDomains.gollemhag),
									FormSpellDomainTablePair("Anagnosi", spellDomains.anagnosi),
								],
							}}
						/>
					</UIBasics.Box>
				}
			/>
		</div>
	);
}
