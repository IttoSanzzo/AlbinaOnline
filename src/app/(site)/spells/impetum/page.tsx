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
			title="Domínio Impetum"
			icon={`${process.env.ALBINA_API}/favicon/spells/impetum`}
			banner={`${process.env.ALBINA_API}/banner/spells/impetum`}
			anchors={[]}>
			<SpellTypeDisplay
				allSpells={allSpells}
				title="Impetum"
				domain="Impetum"
			/>
		</GenericPageContainer>
	);
}
