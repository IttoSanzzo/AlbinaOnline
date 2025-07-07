"use client";

import { AnchorProps, useSetAnchorNavigation } from "@/libs/stp@hooks";

interface SetAnchorNavigationProps {
	anchors: AnchorProps[];
}
export function SetAnchorNavigation({ anchors }: SetAnchorNavigationProps) {
	useSetAnchorNavigation(anchors, { resetOnUnmount: true });
	return null;
}
