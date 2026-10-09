import { newStyledElement } from "@setsu-tp/styled-components";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../Contexts/VttBoardLayerContext";
import styles from "./BoardLayerSelector.module.css";
import { VttHudGenericButtonA } from "../../Components/VttHudGenericButtonA";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";
import { useLayoutEffect } from "react";

const BoardLayerSelectorContainer = newStyledElement.div(
	styles.boardLayerSelectorContainer,
);

export function BoardLayerSelector() {
	const { activeLayer, setActiveLayer } = useVttBoardLayerContext();
	const { isMaster } = useCurrentCampaignMember();

	useLayoutEffect(() => {
		const storageActiveLayer = localStorage.getItem("Vtt-Active-Layer");
		if (storageActiveLayer === null) return;
		const layer = Number(storageActiveLayer);
		if (
			Object.values(VttBoardLayer)
				.filter((value): value is number => typeof value === "number")
				.includes(layer)
		)
			setActiveLayer(layer);
	}, [setActiveLayer]);

	function storageSetActiveLayer(layer: VttBoardLayer) {
		localStorage.setItem("Vtt-Active-Layer", `${layer}`);
		if (activeLayer != layer) setActiveLayer(layer);
	}

	return (
		<BoardLayerSelectorContainer>
			{isMaster && (
				<VttHudGenericButtonA
					stpIconName={"MapTrifold"}
					isActive={activeLayer == VttBoardLayer.GridMap}
					onClick={(event) => {
						event.preventDefault();
						storageSetActiveLayer(VttBoardLayer.GridMap);
					}}
				/>
			)}
			<VttHudGenericButtonA
				stpIconName={"PokerChip"}
				isActive={activeLayer == VttBoardLayer.Token}
				onClick={(event) => {
					event.preventDefault();
					storageSetActiveLayer(VttBoardLayer.Token);
				}}
			/>
			<VttHudGenericButtonA
				stpIconName={"Panorama"}
				isActive={activeLayer == VttBoardLayer.Image}
				onClick={(event) => {
					event.preventDefault();
					storageSetActiveLayer(VttBoardLayer.Image);
				}}
			/>
			<VttHudGenericButtonA
				stpIconName={"Palette"}
				isActive={activeLayer == VttBoardLayer.Drawing}
				onClick={(event) => {
					event.preventDefault();
					storageSetActiveLayer(VttBoardLayer.Drawing);
				}}
			/>
		</BoardLayerSelectorContainer>
	);
}
