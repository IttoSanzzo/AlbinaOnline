import {
	CharacterCoinStack,
	Guid,
	KorynCoins,
	LyurCoins,
	VarisCoins,
} from "@/libs/stp@types";
import { KorynCoinsDisplay } from "./subComponents/KorynCoinsDisplay";
import React from "react";
import { LyurCoinsDisplay } from "./subComponents/LyurCoinsDisplay";
import { VarisCoinsDisplay } from "./subComponents/VarisCoinsDisplay";
import { UIBasics } from "@/components/(UIBasics)";

interface CharacterCoinStacksDisplayProps {
	characterId: Guid;
	characterCoinStacks: CharacterCoinStack[];
}
export function CharacterCoinStacksDisplay({
	characterId,
	characterCoinStacks,
}: CharacterCoinStacksDisplayProps) {
	const korynCoinsStackEntry = characterCoinStacks.find(
		(coinStack) => coinStack.unit === "Koryn"
	);
	if (!korynCoinsStackEntry) {
		throw new Error("Character does not have KorynCoins");
	}
	const lyurCoinsStackEntry = characterCoinStacks.find(
		(coinStack) => coinStack.unit === "Lyur"
	);
	if (!lyurCoinsStackEntry) {
		throw new Error("Character does not have LyurCoins");
	}
	const varisCoinsStackEntry = characterCoinStacks.find(
		(coinStack) => coinStack.unit === "Varis"
	);
	if (!varisCoinsStackEntry) {
		throw new Error("Character does not have VarisCoins");
	}

	return (
		<UIBasics.ToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Moedas"
			memoryId={`${characterId}-Money`}>
			<UIBasics.Carousel
				memoryId={`${characterId}-Money`}
				minWidth={260}
				slidesSpacing={10}
				slidesPerView={1}
				slidesOrigin={"center"}
				slideChilds={[
					<KorynCoinsDisplay
						korynCoins={korynCoinsStackEntry.coins as KorynCoins}
					/>,
					<LyurCoinsDisplay
						lyurCoins={lyurCoinsStackEntry.coins as LyurCoins}
					/>,
					<VarisCoinsDisplay
						varisCoins={varisCoinsStackEntry.coins as VarisCoins}
					/>,
				]}
			/>
		</UIBasics.ToggleHeader>
	);
}
