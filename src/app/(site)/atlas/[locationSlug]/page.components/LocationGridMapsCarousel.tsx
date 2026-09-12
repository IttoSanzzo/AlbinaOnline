import { UIBasics } from "@/components/(UIBasics)";
import { GridMap } from "@/libs/stp@types/dataTypes/gridMap";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { GridMapCard } from "../../page.components/GridMapsModal/GridMapCard";

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
					<GridMapCard
						key={map.id}
						gridMap={map}
					/>
				))}
			/>
		</UIBasics.Box>
	);
}
