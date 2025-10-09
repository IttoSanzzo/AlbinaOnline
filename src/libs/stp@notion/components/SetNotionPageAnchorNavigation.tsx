"use client";

import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";

function getAnchorPropsFromNotionHeadersInBody(
	elements: NodeListOf<HTMLElement>,
	setAnchorProps: Dispatch<SetStateAction<AnchorProps[]>>
): void {
	elements.forEach((headerElement) => {
		if (!headerElement.dataset.anchorPropRetrieved) {
			headerElement.dataset.anchorPropRetrieved = "true";

			const id = headerElement.getAttribute("data-id") || "";
			const indentation =
				Number(
					headerElement.classList[1][headerElement.classList[1].length - 1]
				) - 1;

			const name =
				(
					headerElement.firstChild!.childNodes[1] as unknown as {
						title: string;
					}
				).title ||
				headerElement.firstChild!.childNodes[1].textContent ||
				"";

			setAnchorProps((state) => [
				...state,
				{
					id: id,
					name: name.replaceAll("》", ""),
					indentation: indentation as 0 | 1 | 2,
				},
			]);
		}
	});
}

export default function SetNotionPageAnchorNavigation() {
	const [anchorProps, setAnchorProps] = useState<AnchorProps[]>([]);

	useLayoutEffect(() => {
		const observer = new MutationObserver(() => {
			getAnchorPropsFromNotionHeadersInBody(
				document.querySelectorAll<HTMLElement>(".notion-h"),
				setAnchorProps
			);
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [setAnchorProps]);

	return <SetAnchorNavigation anchors={anchorProps} />;
}
