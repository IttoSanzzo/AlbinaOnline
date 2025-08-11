import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { SpellData, SpellDomain } from "@/libs/stp@types";

interface SpellTypeDisplayProps {
	allSpells: SpellData[];
	domain: keyof typeof SpellDomain;
}

export default function SpellTypeDisplay({
	allSpells,
	domain,
}: SpellTypeDisplayProps) {
	const allSpellsFromThisType = allSpells.filter((spell) =>
		spell.spellDomains.includes(domain)
	);

	const allSpellsOrdenedByLevel = allSpellsFromThisType.reduce<SpellData[][]>(
		(acc, spell) => {
			const level = spell.domainLevel;
			if (!acc[level]) acc[level] = [];
			acc[level].push(spell);
			return acc;
		},
		[]
	);

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			{allSpellsOrdenedByLevel.map((spellLevel, level) => {
				return (
					<div key={level}>
						<UIBasics.Header
							textAlign="center"
							textColor="purple"
							children={`Nível ${level}`}
						/>
						{
							<UIBasics.List.Grid
								backgroundColor="purple"
								children={spellLevel.map((spell) => (
									<StyledLink
										key={spell.id}
										title={spell.name}
										href={`/spells/${spell.slug}`}
										icon={spell.iconUrl}
									/>
								))}
							/>
						}
					</div>
				);
			})}
		</UIBasics.Box>
	);
}
