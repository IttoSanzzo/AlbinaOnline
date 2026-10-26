import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo } from "react";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttTokenStore } from "../../../Stores/VttTokenStore";
import { VttTokenElementWrapper } from "./VttTokenElementWrapper";

const TokenBoardLayerContainer = newStyledElement.div(
	styles.tokenBoardLayerContainer,
);

export const TokenBoardLayer = memo(function TokenBoardLayer() {
	const activeSceneId = useVttContext((state) => state.activeSceneId);
	const tokenIdsPerScene = useVttTokenStore((store) => store.tokenIdsPerScene);

	if (!activeSceneId) return null;
	return (
		<TokenBoardLayerContainer>
			{[...(tokenIdsPerScene.get(activeSceneId) ?? [])].map((tokenId) => (
				<VttTokenElementWrapper
					key={tokenId}
					vttTokenId={tokenId}
				/>
			))}
		</TokenBoardLayerContainer>
	);
});
