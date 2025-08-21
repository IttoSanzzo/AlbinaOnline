import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { UserFavoritesGrouped } from "@/libs/stp@types";

interface UserFavoriteCarouselProps {
	favorites: UserFavoritesGrouped;
	favoriteType: keyof UserFavoritesGrouped;
	routeBase: string;
	favoriteName: string;
}

export function UserFavoriteCarousel({
	favorites,
	favoriteType,
	routeBase,
	favoriteName,
}: UserFavoriteCarouselProps) {
	const indentifier = favoriteType == "character" ? "id" : "slug";
	return (
		<UIBasics.Box backgroundColor="purple">
			<UIBasics.ToggleHeader
				title={favoriteName}
				titleAlign="left"
				children={
					<UIBasics.Carousel
						slidesOrigin={"center"}
						slidesSpacing={10}
						minWidth={150}
						slideChilds={favorites[favoriteType].map((favorite) => (
							<StyledLinkCard
								size={150}
								key={favorite.target.id}
								href={`/${routeBase}/${String(
									favorite.target[indentifier as keyof typeof favorite.target]
								)}`}
								title={favorite.target.name}
								artworkUrl={favorite.target.iconUrl}
							/>
						))}
					/>
				}
			/>
		</UIBasics.Box>
	);
}
