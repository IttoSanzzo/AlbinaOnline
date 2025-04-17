"use client";

import { Star } from "@phosphor-icons/react/Star";
import { FavoriteButtonContainer } from "./styledElements";
import { useState } from "react";

export default function FavoriteButton() {
	const [isFavorite, setIsFavorite] = useState<boolean>(false);

	function handleAddFavorite() {
		console.log("Add Favorite");
		setIsFavorite(true);
	}
	function handleRemoveFavorite() {
		console.log("Remove Favorite");
		setIsFavorite(false);
	}

	return (
		<FavoriteButtonContainer>
			{isFavorite ? (
				<button
					title="Unfavorite Page"
					onClick={handleRemoveFavorite}>
					<Star
						color="#ffee00"
						weight="fill"
					/>
				</button>
			) : (
				<button
					title="Favorite Page"
					onClick={handleAddFavorite}>
					<Star
						color="#7b7b7b"
						weight="bold"
					/>
				</button>
			)}
		</FavoriteButtonContainer>
	);
}
