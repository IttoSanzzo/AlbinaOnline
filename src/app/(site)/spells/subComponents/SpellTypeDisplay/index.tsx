import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
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
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			{allSpellsOrdenedByLevel.map((spellLevel, level) => {
				return (
					<div key={level}>
						<NotionHeader
							textAlign="center"
							textColor="purple"
							children={`Nível ${level}`}
						/>
						{
							<NotionGridList
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
		</NotionBox>
	);
}
