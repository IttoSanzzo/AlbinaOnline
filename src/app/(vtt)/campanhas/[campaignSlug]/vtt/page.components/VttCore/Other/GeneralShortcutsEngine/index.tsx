import { memo, useEffect } from "react";
import {
	useVttBoardLayerContext,
	VttBoardLayer,
} from "../../../Contexts/VttBoardLayerContext";

export const GeneralShortcutsEngine = memo(function GeneralShortcutsEngine() {
	const activeLayer = useVttBoardLayerContext((state) => state.activeLayer);
	const setActiveLayer = useVttBoardLayerContext(
		(state) => state.setActiveLayer,
	);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			switch (event.code) {
				case "F11":
					event.preventDefault();
					handleImmersiveMode();
					break;
				case "KeyG":
					if (event.ctrlKey) event.preventDefault();
					break;
				case "Digit1":
					if (activeLayer != VttBoardLayer.GridMap)
						setActiveLayer(VttBoardLayer.GridMap);
					break;
				case "Digit2":
					if (activeLayer != VttBoardLayer.Image)
						setActiveLayer(VttBoardLayer.Image);
					break;
				case "Digit3":
					if (activeLayer != VttBoardLayer.Token)
						setActiveLayer(VttBoardLayer.Token);
					break;
				case "Digit4":
					if (activeLayer != VttBoardLayer.Drawing)
						setActiveLayer(VttBoardLayer.Drawing);
					break;
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeLayer, setActiveLayer]);
	return null;
});

async function handleImmersiveMode() {
	if (document.fullscreenElement) {
		document.exitFullscreen();
		return;
	}
	try {
		await document.documentElement.requestFullscreen();
	} catch {
		if (document.fullscreenElement) await document.exitFullscreen();
	}
}
