import { useEffect } from "react";

export function GeneralShortcutsEngine() {
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
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	return null;
}

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
