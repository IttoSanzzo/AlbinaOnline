"use client";

import { Star } from "@phosphor-icons/react/Star";
import { FavoriteButtonContainer } from "./styledElements";

export function FavoriteButton() {
	const isFavorite = false;

	return (
		<FavoriteButtonContainer>
			{isFavorite ? (
				<button title="Unfavorite Page">
					<Star
						color="#ffee00"
						weight="fill"
					/>
				</button>
			) : (
				<button title="Favorite Page">
					<Star
						color="#7b7b7b"
						weight="bold"
					/>
				</button>
			)}
		</FavoriteButtonContainer>
	);
}
