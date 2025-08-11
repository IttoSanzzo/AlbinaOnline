import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { UserFavoritesGrouped } from "@/libs/stp@types";
import { capitalize } from "@/utils/StringUtils";
import { newStyledElement } from "@setsu-tp/styled-components";

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
	// const test = newStyledElement.div(style.testeContainer);

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
								href={`/${routeBase}/${(favorite.target as any)[indentifier]}`}
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
