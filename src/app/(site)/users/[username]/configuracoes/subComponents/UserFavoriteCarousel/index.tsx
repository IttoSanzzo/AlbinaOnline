import { StyledLinkCard } from "@/components/(Design)";
import { NotionToggleHeader } from "@/components/(NotionBased)";
import { Carousel } from "@/components/(UTILS)";
import { UserFavoritesGrouped } from "@/libs/stp@types";

interface UserFavoriteCarouselProps {
	favorites: UserFavoritesGrouped;
	favoriteType: keyof UserFavoritesGrouped;
	routeBase: string;
}

export function UserFavoriteCarousel({
	favorites,
	favoriteType,
	routeBase,
}: UserFavoriteCarouselProps) {
	console.log(favorites);
	const indentifier = favoriteType == "character" ? "id" : "slug";
	return (
		<NotionToggleHeader
			title={routeBase}
			titleAlign="left"
			children={
				<Carousel
					slidesOrigin={"center"}
					slidesSpacing={10}
					minWidth={150}
					slideChilds={favorites[favoriteType].map((favorite) => (
						<StyledLinkCard
							size={150}
							key={favorite.target.id}
							href={`/${routeBase}/${(favorite.target as any)[indentifier]}`}
							title={favorite.target.name}
							artworkUrl={favorite.target.iconUrl}
						/>
					))}
				/>
			}
		/>
	);
}
