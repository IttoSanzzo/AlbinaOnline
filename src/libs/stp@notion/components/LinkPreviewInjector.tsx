"use client";

import { LinkPreview } from "@/components/(SPECIAL)";
import { Guid } from "@/libs/stp@types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type InjectedPreview = {
	id: Guid;
	href: string;
	title: string;
	container: HTMLElement;
};

export function LinkPreviewInjector() {
	const [previews, setPreviews] = useState<InjectedPreview[]>([]);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const links = document.querySelectorAll<HTMLElement>(".notion-link");
			links.forEach((link) => {
				if (!link.dataset.previewInjected) {
					link.dataset.previewInjected = "true";

					const href =
						link.getAttribute("data-href") || link.getAttribute("href") || "";
					const title =
						link.getAttribute("data-title") || link.textContent || "";

					setPreviews((state) => [
						...state,
						{ id: Guid.NewGuid(), href, title, container: link },
					]);
				}
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);

	return (
		<>
			{previews.map((preview) =>
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
