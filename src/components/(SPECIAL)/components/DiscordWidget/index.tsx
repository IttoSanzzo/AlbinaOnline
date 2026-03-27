"use client";

import { useCurrentUser, useDiscordWidget } from "@/libs/stp@hooks";
import { useEffect } from "react";

export function DiscordWidget() {
	const { loading, user } = useCurrentUser();
	const { isSet, setIsSet, setDiscordWidget } = useDiscordWidget();

	useEffect(() => {
		async function createCrate() {
			if (isSet || loading || !user) return;

			const result = await import("@widgetbot/crate");
			const Crate = await result.cdn();
			const newCrate = new Crate({
				server: "570314631214661632",
				channel: "756752942085963847",
				location: ["bottom", "right"],
				color: "#282428",
				username: user.nickname,
				avatar: user.iconUrl,
				defer: true,
			});

			const element = document.querySelector("crate");
			if (element) {
				const crateElement = (element.firstChild as Element).shadowRoot
					?.firstChild?.firstChild as HTMLElement;
				if (crateElement) {
					let outsideClickHandler: ((event: MouseEvent) => void) | null = null;

					const observer = new MutationObserver(() => {
						const isOpen = crateElement.classList.contains("open");
						if (isOpen && !outsideClickHandler) {
							outsideClickHandler = (event: MouseEvent) => {
								if (!crateElement.contains(event.target as Node)) {
									newCrate.toggle(false);
								}
							};
							setTimeout(() => {
								document.addEventListener("click", outsideClickHandler!);
							}, 0);
						} else if (!isOpen && outsideClickHandler) {
							document.removeEventListener("click", outsideClickHandler);
							outsideClickHandler = null;
						}
					});
					observer.observe(crateElement, {
						attributes: true,
						attributeFilter: ["class"],
					});
				}
			}
			setDiscordWidget(newCrate);
			setIsSet(true);
		}
		createCrate();
	}, [loading, user]);

	return null;
}
