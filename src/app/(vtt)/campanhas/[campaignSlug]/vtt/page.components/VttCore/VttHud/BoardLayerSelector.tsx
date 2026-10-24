import { newStyledElement } from "@setsu-tp/styled-components";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../Contexts/VttBoardLayerContext";
import styles from "./BoardLayerSelector.module.css";
import { VttHudGenericButtonA } from "../../Components/VttHudGenericButtonA";
import { useCurrentCampaignMember } from "@/libs/stp@hooks";

const BoardLayerSelectorContainer = newStyledElement.div(
	styles.boardLayerSelectorContainer,
);

export function BoardLayerSelector() {
	const activeLayer = useVttBoardLayerContext((state) => state.activeLayer);
	const setActiveLayer = useVttBoardLayerContext(
		(state) => state.setActiveLayer,
	);
	const { isMaster } = useCurrentCampaignMember();

	return (
		<BoardLayerSelectorContainer>
			{isMaster && (
				<VttHudGenericButtonA
					stpIconName={"MapTrifold"}
					isActive={activeLayer == VttBoardLayer.GridMap}
					onClick={(event) => {
						event.preventDefault();
						setActiveLayer(VttBoardLayer.GridMap);
					}}
				/>
			)}
			<VttHudGenericButtonA
				stpIconName={"Panorama"}
				isActive={activeLayer == VttBoardLayer.Image}
				onClick={(event) => {
					event.preventDefault();
					setActiveLayer(VttBoardLayer.Image);
				}}
			/>
			<VttHudGenericButtonA
				stpIconName={"PokerChip"}
				isActive={activeLayer == VttBoardLayer.Token}
				onClick={(event) => {
					event.preventDefault();
					setActiveLayer(VttBoardLayer.Token);
				}}
			/>
			<VttHudGenericButtonA
				stpIconName={"Palette"}
				isActive={activeLayer == VttBoardLayer.Drawing}
				onClick={(event) => {
					event.preventDefault();
					setActiveLayer(VttBoardLayer.Drawing);
				}}
			/>
		</BoardLayerSelectorContainer>
	);
}
