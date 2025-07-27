import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";

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
	return (
		<CharacterDrawerBaseHeader
			title="Domínios"
			backgroundColor="purple"
			memoryId={`${spellDomains.characterId}-SpellDomains`}>
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
									CommonSpellDomainTablePair("Impetum", spellDomains),
									CommonSpellDomainTablePair("Khranitel", spellDomains),
									CommonSpellDomainTablePair("Aufbringen", spellDomains),
									CommonSpellDomainTablePair("Migaku", spellDomains),
									CommonSpellDomainTablePair("Affaiblir", spellDomains),
									CommonSpellDomainTablePair("Vitaeregio", spellDomains),
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
									CommonSpellDomainTablePair("Gaizào", spellDomains),
									CommonSpellDomainTablePair("Verstand", spellDomains),
									CommonSpellDomainTablePair("Sajak", spellDomains),
									CommonSpellDomainTablePair("Idaítera", spellDomains),
									CommonSpellDomainTablePair("Gollemhag", spellDomains),
									CommonSpellDomainTablePair("Anagnosi", spellDomains),
								],
							}}
						/>
					</NotionBox>
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
