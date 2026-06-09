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
		(coinStack) => coinStack.unit === "Koryn",
	);
	if (!korynCoinsStackEntry) {
		throw new Error("Character does not have KorynCoins");
	}
	const lyurCoinsStackEntry = characterCoinStacks.find(
		(coinStack) => coinStack.unit === "Lyur",
	);
	if (!lyurCoinsStackEntry) {
		throw new Error("Character does not have LyurCoins");
	}
	const varisCoinsStackEntry = characterCoinStacks.find(
		(coinStack) => coinStack.unit === "Varis",
	);
	if (!varisCoinsStackEntry) {
		throw new Error("Character does not have VarisCoins");
	}

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			style={{ borderTopRightRadius: "var(--rd-md)" }}
			withoutBorder
			withoutMargin
			withoutPadding
			withoutBorderRadius>
			<UIBasics.Header
				textAlign="center"
				textColor="yellow"
				children={"Moedas"}
				headerType="h2"
				withoutMargin
			/>
			<UIBasics.Box
				withoutBorder
				withoutMargin
				style={{
					position: "relative",
					maxHeight: "450px",
					overflowY: "scroll",
				}}>
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
			</UIBasics.Box>
		</UIBasics.Box>
	);
}
