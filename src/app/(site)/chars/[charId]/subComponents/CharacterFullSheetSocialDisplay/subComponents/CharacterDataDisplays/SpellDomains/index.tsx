import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSpellDomains, SpellDomain } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { normalizeText } from "@/utils/StringUtils";

function FormSpellDomainTablePair(name: string, level: number) {
	const lowercaseName = name === "General" ? "" : normalizeText(name);
	return [
		<StyledLink
			title={name}
			href={`/spells/${lowercaseName}`}
			icon={getAlbinaApiFullAddress(`/favicon/spells/${lowercaseName}`)}
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
	const domains = Object.keys(SpellDomain)
		.filter((key) => Number.isNaN(Number(key)) && key != "Unknown")
		.map((key) => key.toLowerCase());
	const generalLevel: number = Math.max(
		-1,
		Math.min(
			4,
			Math.floor(
				Object.entries(spellDomains)
					.filter((domain) => domains.includes(domain[0]))
					.map((domain) => domain[1] as number)
					.sort((a, b) => b - a)
					.slice(0, 4)
					.reduce((acc, value) => acc + value, 0) / 6,
			),
		),
	);

	return (
		<div>
			<UIBasics.Box
				backgroundColor="purple"
				withoutBorder
				withoutMargin
				style={{ paddingBottom: 0 }}>
				<UIBasics.Table
					textColor="pink"
					tableData={{
						tableLanes: [FormSpellDomainTablePair("General", generalLevel)],
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
										spellDomains.aufbringen,
									),
									FormSpellDomainTablePair("Migaku", spellDomains.migaku),
									FormSpellDomainTablePair("Affaiblir", spellDomains.affaiblir),
									FormSpellDomainTablePair(
										"Vitaeregio",
										spellDomains.vitaeregio,
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
