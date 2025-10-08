import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { SpellData } from "@/libs/stp@types";

interface AllSpellsDisplayProps {
	allSpells: SpellData[];
}

export default function AllSpellsDisplay({ allSpells }: AllSpellsDisplayProps) {
	const allSpellsOrdenedByLevel = allSpells.reduce<SpellData[][]>(
		(acc, spell) => {
			const level = spell.domainLevel;
			if (!acc[level]) acc[level] = [];
			acc[level].push(spell);
			return acc;
		},
		[]
	);

	return (
		<>
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
		</>
	);
}
