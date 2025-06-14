import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import AllSpellsDisplay from "./subComponents/AllSpellsDisplay";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";

export default async function Spells() {
	const response = await fetch(`${process.env.ALBINA_API}/spells`, {
		cache: await getCacheMode(),
	});
	const allRawSpells: SpellData[] = await response.json();

	const allSpells: SpellData[] = allRawSpells.sort((a, b) =>
		a.name.localeCompare(b.name)
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
		<GenericPageContainer
			title="Todas os Spells"
			icon={`${process.env.ALBINA_API}/favicon/spells`}
			banner={`${process.env.ALBINA_API}/banner/spells`}
			anchors={[]}>
			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionHeader
					textAlign="center"
					textColor="purple"
					children={"Domínios"}
				/>
				<NotionGridList
					backgroundColor="darkGray"
					children={DomainInfos.map((DomainInfo) => (
						<StyledLink
							key={DomainInfo[0]}
							href={`/spells/${DomainInfo[1]}`}
							title={DomainInfo[0]}
							icon={`${process.env.ALBINA_API}/favicon/spells/${DomainInfo[1]}`}
						/>
					))}
				/>
			</NotionBox>

			<AllSpellsDisplay allSpells={allSpells} />
		</GenericPageContainer>
	);
}
