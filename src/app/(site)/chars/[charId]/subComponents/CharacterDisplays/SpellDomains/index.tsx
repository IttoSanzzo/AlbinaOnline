import { StyledLink } from "@/components/(Design)";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { useCurrentCharacterAccessLevel } from "@/libs/stp@hooks";
import { AccessLevel, CharacterSpellDomains } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";
import { useState } from "react";
import { UpdateForm } from "./UpdateForm";

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
	characterId: string;
	spellDomains: CharacterSpellDomains;
}
export function CharacterSpellDomainsDisplay({
	characterId,
	spellDomains,
}: CharacterSpellDomainsDisplayProps) {
	const { accessLevel, isSet } = useCurrentCharacterAccessLevel();
	const [localSpellDomains, setLocalSpellDomains] =
		useState<CharacterSpellDomains>(spellDomains);

	// console.log(localSpellDomains);

	return (
		<NotionToggleHeader
			title="Domínios"
			titleColor="gray"
			backgroundColor="darkGray"
			contentMargin="none"
			memoryId={`${spellDomains.characterId}-SpellDomains`}>
			<NotionBox
				withoutPadding
				withoutBorder>
				{isSet == true || accessLevel >= AccessLevel.Edit ? (
					<UpdateForm
						characterId={characterId}
						spellDomains={localSpellDomains}
						setSpellDomains={setLocalSpellDomains}
					/>
				) : (
					<>
						<NotionBox
							backgroundColor="purple"
							withoutBorder
							withoutMargin>
							<NotionTable
								textColor="pink"
								tableData={{
									tableLanes: [
										CommonSpellDomainTablePair("General", localSpellDomains),
									],
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
												CommonSpellDomainTablePair(
													"Impetum",
													localSpellDomains
												),
												CommonSpellDomainTablePair(
													"Khranitel",
													localSpellDomains
												),
												CommonSpellDomainTablePair(
													"Aufbringen",
													localSpellDomains
												),
												CommonSpellDomainTablePair("Migaku", localSpellDomains),
												CommonSpellDomainTablePair(
													"Affaiblir",
													localSpellDomains
												),
												CommonSpellDomainTablePair(
													"Vitaeregio",
													localSpellDomains
												),
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
												CommonSpellDomainTablePair("Gaizào", localSpellDomains),
												CommonSpellDomainTablePair(
													"Verstand",
													localSpellDomains
												),
												CommonSpellDomainTablePair("Sajak", localSpellDomains),
												CommonSpellDomainTablePair(
													"Idaítera",
													localSpellDomains
												),
												CommonSpellDomainTablePair(
													"Gollemhag",
													localSpellDomains
												),
												CommonSpellDomainTablePair(
													"Anagnosi",
													localSpellDomains
												),
											],
										}}
									/>
								</NotionBox>
							}
						/>
					</>
				)}
			</NotionBox>
		</NotionToggleHeader>
	);
}
