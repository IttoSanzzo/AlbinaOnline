import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import AllSpellsDisplay from "./subComponents/AllSpellsDisplay";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Domínios", id: "Domínios" },
	{ name: "Nível 0", id: "Nível 0" },
	{ name: "Nível 1", id: "Nível 1" },
	{ name: "Nível 2", id: "Nível 2" },
	{ name: "Nível 3", id: "Nível 3" },
	{ name: "Nível 4", id: "Nível 4" },
	{ name: "Nível 5", id: "Nível 5" },
	{ name: "Nível 6", id: "Nível 6" },
	{ name: "Nível 7", id: "Nível 7" },
	{ name: "Nível 8", id: "Nível 8" },
	{ name: "Nível 9", id: "Nível 9" },
	{ name: "Nível 10", id: "Nível 10" },
	{ name: "Nível 11", id: "Nível 11" },
	{ name: "Nível 12", id: "Nível 12" },
];

export default async function SpellsPage() {
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
			icon={`${process.env.ALBINA_API}/favicon/core-page/spells`}
			banner={`${process.env.ALBINA_API}/banner/core-page/spells`}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

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
