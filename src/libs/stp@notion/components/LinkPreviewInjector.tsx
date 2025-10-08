"use client";

import { LinkPreview } from "@/components/(SPECIAL)";
import { Guid } from "@/libs/stp@types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function injectPreviewInHtmlElementList(
	elements: NodeListOf<HTMLElement>,
	setPreviewState: Dispatch<SetStateAction<InjectedPreview[]>>
): void {
	elements.forEach((link) => {
		if (!link.dataset.previewInjected) {
			link.dataset.previewInjected = "true";

			const href =
				link.getAttribute("data-href") || link.getAttribute("href") || "";
			const title = link.getAttribute("data-title") || link.textContent || "";

			setPreviewState((state) => [
				...state,
				{ id: Guid.NewGuid(), href, title, container: link },
			]);
		}
	});
}

type InjectedPreview = {
	id: Guid;
	href: string;
	title: string;
	container: HTMLElement;
};

export function LinkPreviewInjector() {
	const [notionLinkPreviews, setNotionLinkPreviews] = useState<
		InjectedPreview[]
	>([]);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			injectPreviewInHtmlElementList(
				document.querySelectorAll<HTMLElement>(".notion-link"),
				setNotionLinkPreviews
			);
			injectPreviewInHtmlElementList(
				document.querySelectorAll<HTMLElement>(".notion-page-link"),
				setNotionLinkPreviews
			);
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);

	return (
		<>
			{notionLinkPreviews.map((preview) =>
				createPortal(
					<LinkPreview
						key={preview.id}
						href={preview.href}
						title={preview.title}
					/>,
					preview.container
				)
			)}
		</>
	);
}
