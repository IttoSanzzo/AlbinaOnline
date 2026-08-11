import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";

interface BestiaryPageViewProps {
	entities: CreatureData[];
}
export default function BestiaryPageView({ entities }: BestiaryPageViewProps) {
	return (
		<>
			{/* <HiddenCreatureList /> */}
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.List.Grid
					withoutMargin
					direction="row"
					backgroundColor="darkGray">
					{entities.map((entity) => (
						<StyledLinkCard
							key={entity.id}
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
