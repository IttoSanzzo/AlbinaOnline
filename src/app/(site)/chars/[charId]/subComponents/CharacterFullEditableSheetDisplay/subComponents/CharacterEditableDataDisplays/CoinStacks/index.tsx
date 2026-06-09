import { useContext } from "react";
import { CharacterIdContext } from "../../CharacterEditableSheetContextProviders";
import {
	CharacterCoinStack,
	KorynCoins,
	LyurCoins,
	VarisCoins,
} from "@/libs/stp@types";
import { KorynCoinsController } from "./subComponents/KorynCoinsController";
import { LyurCoinsController } from "./subComponents/LyurCoinsController";
import { VarisCoinsController } from "./subComponents/VarisCoinsController";
import React from "react";
import { UIBasics } from "@/components/(UIBasics)";

interface CharacterCoinStacksDisplayProps {
	characterCoinStacks: CharacterCoinStack[];
}
export function _CharacterCoinStacksDisplay({
	characterCoinStacks,
}: CharacterCoinStacksDisplayProps) {
	const { characterId } = useContext(CharacterIdContext);

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
						<KorynCoinsController
							korynCoins={korynCoinsStackEntry.coins as KorynCoins}
						/>,
						<LyurCoinsController
							lyurCoins={lyurCoinsStackEntry.coins as LyurCoins}
						/>,
						<VarisCoinsController
							varisCoins={varisCoinsStackEntry.coins as VarisCoins}
						/>,
					]}
				/>
			</UIBasics.Box>
		</UIBasics.Box>
	);
}

export const CharacterCoinStacksDisplay = React.memo(
	_CharacterCoinStacksDisplay,
);
