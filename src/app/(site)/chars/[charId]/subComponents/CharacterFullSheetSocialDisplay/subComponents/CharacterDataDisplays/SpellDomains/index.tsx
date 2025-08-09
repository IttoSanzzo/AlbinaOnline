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
import React from "react";

function FormSpellDomainTablePair(name: string, level: number) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={getAlbinaApiAddress(`/favicon/spells/${lowercaseName}`)}
		/>,
		<NotionText
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
			<NotionBox
				backgroundColor="purple"
				withoutBorder
				withoutMargin>
				<NotionTable
					textColor="pink"
					tableData={{
						tableLanes: [
							FormSpellDomainTablePair("General", spellDomains.general),
						],
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
									FormSpellDomainTablePair("Gaizào", spellDomains.gaizao),
									FormSpellDomainTablePair("Verstand", spellDomains.verstand),
									FormSpellDomainTablePair("Sajak", spellDomains.sajak),
									FormSpellDomainTablePair("Idaítera", spellDomains.idaitera),
									FormSpellDomainTablePair("Gollemhag", spellDomains.gollemhag),
									FormSpellDomainTablePair("Anagnosi", spellDomains.anagnosi),
								],
							}}
						/>
					</NotionBox>
				}
			/>
		</div>
	);
}
