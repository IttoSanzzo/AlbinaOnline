import { StyledLinkCard } from "@/components/(Design)";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { UserFavoritesGrouped } from "@/libs/stp@types";
import Link from "next/link";

function generalRouteForFavoriteGroupType(
	favoriteType: keyof UserFavoritesGrouped
) {
	switch (favoriteType) {
		case "character":
			return "/chars";
		case "item":
			return "/items";
		case "mastery":
			return "/maestrias";
		case "race":
			return "/racas";
		case "skill":
			return "/skills";
		case "spell":
			return "/spells";
		case "trait":
			return "/tracos";
		default:
			return "";
	}
}

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
		<UIBasics.Box
			backgroundColor="gray"
			withoutBorder
			withoutPadding
			withoutMargin
			withoutBorderRadius>
			<UIBasics.Header
				textAlign="center"
				textColor="gray">
				<Link
					style={{ color: StandartTextColor.gray }}
					href={generalRouteForFavoriteGroupType(favoriteType)}>
					{favoriteName}
				</Link>
			</UIBasics.Header>
			<UIBasics.Box
				height={125}
				withoutBorderRadius
				withoutMargin
				backgroundColor="darkGray">
				<UIBasics.Carousel
					slidesOrigin={"center"}
					slidesSpacing={10}
					minWidth={100}
					slideChilds={favorites[favoriteType].map((favorite) => (
						<StyledLinkCard
							size={100}
							key={favorite.target.id}
							href={`/${routeBase}/${String(
								favorite.target[indentifier as keyof typeof favorite.target]
							)}`}
							title={favorite.target.name}
							artworkUrl={favorite.target.iconUrl}
						/>
					))}
				/>
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
