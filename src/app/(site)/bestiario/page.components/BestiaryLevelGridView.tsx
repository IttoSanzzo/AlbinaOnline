import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CreatureData } from "@/libs/stp@types";

interface BestiaryLevelGridViewProps {
	creatures: CreatureData[];
}
export function BestiaryLevelGridView({
	creatures,
}: BestiaryLevelGridViewProps) {
	if (creatures.length == 0) return null;
	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				withoutMargin
				textAlign="center"
				textColor="yellow"
				children={`Nível ${creatures[0].level}`}
			/>
			<UIBasics.List.Grid
				withoutMargin
				direction="row"
				columnWidth={140}
				backgroundColor="darkGray">
				{creatures.map((entity) => (
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
	);
}
