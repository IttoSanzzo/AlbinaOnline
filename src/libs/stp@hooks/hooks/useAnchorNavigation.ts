"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	AnchorProps,
	useAnchorNavigationStore,
} from "../stores/useAnchorNavigationStore";

export function useAnchorNavigation() {
	return useAnchorNavigationStore(
		useShallow((state) => ({
			anchors: state.anchors,
			isSet: state.isSet,
			reset: state.reset,
		}))
	);
}

export function useSetAnchorNavigation(
	anchors: AnchorProps[],
	options?: { resetOnUnmount?: boolean }
) {
	const { setAnchors, setIsSet, reset } = useAnchorNavigationStore(
		useShallow((state) => ({
			setAnchors: state.setAnchors,
			setIsSet: state.setIsSet,
			reset: state.reset,
		}))
	);
	useEffect(() => {
		setAnchors(anchors);
		setIsSet(true);
		return () => {
			if (options?.resetOnUnmount) {
				reset();
			}
		};
	}, [anchors]);
}
