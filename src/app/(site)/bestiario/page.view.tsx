import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";
import { BestiarySearchWithLevel } from "./page.components/BestiarySearchWithLevel";
import { BestiarySearchWithHidden } from "./page.components/BestiarySearchWithHidden";

interface BestiaryPageViewProps {
	entities: CreatureData[];
}
export default async function BestiaryPageView({
	entities,
}: BestiaryPageViewProps) {
	const letterIds: Set<string> = new Set();

	return (
		<>
			<BestiarySearchWithHidden publicCreatures={entities} />

			{/* <HiddenCreatureList /> */}

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textAlign="center"
					textColor="orange">
					Todos
				</UIBasics.Header>
				<UIBasics.List.Grid
					withoutMargin
					direction="row"
					columnWidth={140}
					backgroundColor="darkGray">
					{entities.map((entity) => (
						<StyledLinkCard
							key={entity.id}
							id={checkLetter(letterIds, (entity.name[0] ?? "").toLowerCase())}
							artworkUrl={entity.iconUrl}
							href={`/bestiario/${entity.slug}`}
							title={entity.name}
							titleAlwaysOpen
							withEditLink
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>
		</>
	);
}

function checkLetter(
	set: Set<string>,
	letter: string = "",
): string | undefined {
	if (set.has(letter)) return undefined;
	set.add(letter);
	return `letter-${letter}`;
}
