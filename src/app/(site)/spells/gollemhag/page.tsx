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
			title="Domínio Gollemhag"
			icon={`${process.env.ALBINA_API}/favicon/spells/gollemhag`}
			banner={`${process.env.ALBINA_API}/banner/spells/gollemhag`}
			anchors={[]}>
			<SpellTypeDisplay
				allSpells={allSpells}
				title="Gollemhag"
				domain="Gollemhag"
			/>
		</GenericPageContainer>
	);
}
