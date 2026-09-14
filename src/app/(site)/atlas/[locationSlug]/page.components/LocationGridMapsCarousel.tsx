import { UIBasics } from "@/components/(UIBasics)";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GridMapInteractionModal } from "../../page.components/GridMapsModal/GridMapInteractionModal";

interface LocationGridMapsCarouselProps {
	locationSlug: string;
}
export async function LocationGridMapsCarousel({
	locationSlug,
}: LocationGridMapsCarouselProps) {
	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/${locationSlug}/gridmaps`),
		{
			next: {
				tags: ["/gridmaps"],
			},
		},
	);
	if (!response.ok) return null;
	const gridMaps: GridMap[] = await response.json();

	if (gridMaps.length == 0) return null;
	return (
		<UIBasics.Box backgroundColor={"darkerGray"}>
			<UIBasics.Carousel
				slideChilds={gridMaps.map((map) => (
					<GridMapInteractionModal
						key={map.id}
						gridMap={map}
						isInVtt={false}
					/>
				))}
			/>
		</UIBasics.Box>
	);
}
