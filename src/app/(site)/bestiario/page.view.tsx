import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";
import { BestiarySearchWithLevel } from "./page.components/BestiarySearchWithLevel";

interface BestiaryPageViewProps {
	entities: CreatureData[];
}
export default function BestiaryPageView({ entities }: BestiaryPageViewProps) {
	return (
		<>
			<BestiarySearchWithLevel creatures={entities} />

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
							artworkUrl={entity.iconUrl}
							href={`/bestiario/${entity.slug}`}
							title={entity.name}
							prefetch={false}
							titleAlwaysOpen
							withEditLink
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>
		</>
	);
}
