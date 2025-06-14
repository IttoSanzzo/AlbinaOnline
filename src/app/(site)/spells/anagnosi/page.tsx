import { GenericPageContainer } from "@/components/(Design)";
import { SpellData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import SpellTypeDisplay from "../subComponents/SpellTypeDisplay";

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
			title="Domínio Anagnosi"
			icon={`${process.env.ALBINA_API}/favicon/spells/anagnosi`}
			banner={`${process.env.ALBINA_API}/banner/spells/anagnosi`}
			anchors={[]}>
			<SpellTypeDisplay
				allSpells={allSpells}
				title="Anagnosi"
				domain="Anagnosi"
			/>
		</GenericPageContainer>
	);
}
