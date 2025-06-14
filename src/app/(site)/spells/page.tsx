import { GenericPageContainer } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import AllSpellsDisplay from "./subComponents/AllSpellsDisplay";

export default async function Spells() {
	const response = await fetch(`${process.env.ALBINA_API}/spells`, {
		cache: await getCacheMode(),
	});
	const allRawSpells: SpellData[] = await response.json();

	const allSpells: SpellData[] = allRawSpells.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas os Spells"
			icon={`${process.env.ALBINA_API}/favicon/spells`}
			banner={`${process.env.ALBINA_API}/banner/spells`}
			anchors={[]}>
			<AllSpellsDisplay allSpells={allSpells} />
		</GenericPageContainer>
	);
}
