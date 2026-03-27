"use client";

import { useShallow } from "zustand/react/shallow";
import { useDiscordWidgetStore } from "../stores";

export function useDiscordWidget() {
	return useDiscordWidgetStore(
		useShallow((state) => ({
			isSet: state.isSet,
			setIsSet: state.setIsSet,
			discordWidget: state.discordWidget,
			setDiscordWidget: state.setDiscordWidget,
		})),
	);
}
