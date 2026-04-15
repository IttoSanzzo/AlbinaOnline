"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ShortcutsEngine() {
	const router = useRouter();

	async function pushRoute(event: KeyboardEvent, route: string) {
		event.preventDefault();
		router.push(route);
	}

	useEffect(() => {
		async function handleKeyDown(event: KeyboardEvent) {
			switch (event.key.toLowerCase()) {
				case "f1":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/home");
					else if (event.altKey) pushRoute(event, "/create");
					break;
				case "f2":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/chars");
					break;
				case "f3":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/items");
					break;
				case "f4":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/maestrias");
					break;
				case "f5":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/skills");
					break;
				case "f6":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/spells");
					break;
				case "f7":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/tracos");
					break;
				case "f8":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/racas");
					break;
				case "f12":
					if (event.shiftKey && event.ctrlKey) pushRoute(event, "/sandbox");
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
