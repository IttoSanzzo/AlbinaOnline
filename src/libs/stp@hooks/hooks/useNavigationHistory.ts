"use client";

import { useShallow } from "zustand/shallow";
import { useNavigationHistoryStore } from "../stores/useNavigationHistoryStore";

export function useNavigationHistory() {
	return useNavigationHistoryStore(
		useShallow((state) => ({
			clearHistory: state.clearHistory,
			history: state.history,
			isSet: state.isSet,
			loadHistory: state.loadHistory,
			setHistory: state.setHistory,
			addHistoryEntry: state.addHistoryEntry,
			setIsSet: state.setIsSet,
		})),
	);
}
