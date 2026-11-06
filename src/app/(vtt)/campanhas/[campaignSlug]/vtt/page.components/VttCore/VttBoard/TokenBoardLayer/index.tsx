import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo } from "react";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useVttTokenStore } from "../../../Stores/VttTokenStore";
import { VttTokenElementWrapper } from "./VttTokenElementWrapper";
import { Guid } from "@/libs/stp@types";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";

const TokenBoardLayerContainer = newStyledElement.div(
	styles.tokenBoardLayerContainer,
);

export const TokenBoardLayer = memo(function TokenBoardLayer() {
	const activeSceneId = useVttContext(
		(state) => state.activeSceneId ?? Guid.Empty,
	);
	const activeLayer = useVttBoardLayerContext((state) => state.activeLayer);
	const tokenIdsPerScene = useVttTokenStore((store) => store.tokenIdsPerScene);

	return (
		<TokenBoardLayerContainer
			style={{
				opacity: activeLayer == VttBoardLayer.GridMap ? 0.65 : undefined,
			}}>
			{(tokenIdsPerScene.get(activeSceneId) ?? []).map((tokenId) => (
				<VttTokenElementWrapper
					key={tokenId}
					vttTokenId={tokenId}
				/>
			))}
		</TokenBoardLayerContainer>
	);
});
