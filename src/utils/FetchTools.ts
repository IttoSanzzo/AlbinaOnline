"use client";

import { fullUser } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "./AlbinaApi";

export async function authenticatedFetchAsync(
	input: RequestInfo | URL,
	init: RequestInit = {}
): Promise<Response> {
	const url =
		typeof input === "string" || input instanceof URL
			? input.toString().startsWith("http")
				? input.toString()
				: `${getAlbinaApiAddress()}${input.toString()}`
			: input;
	init.credentials = "include";
	const response = await fetch(url, init);

	if (response.status === 401) {
		const refreshed = await tryRefresh();
		if (!refreshed) return response;
		return await fetch(url, init);
	}
	return response;
}

let refreshingLock: Promise<boolean> | null = null;
async function tryRefresh(): Promise<boolean> {
	if (!refreshingLock) {
		refreshingLock = fetch(`${getAlbinaApiAddress()}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		})
			.then((response) => {
				if (response.status !== 200) {
					if (typeof window !== "undefined") {
						const loginPageLink = `${getAlbinaApiAddress()}/login?redirectTo=${
							window.location.pathname
						}`;
						window.location.href = loginPageLink;
					}
					return false;
				}
				return true;
			})
			.finally(() => {
				refreshingLock = null;
			});
	}
	return await refreshingLock;
}

export async function fetchMe() {
	const response = await authenticatedFetchAsync(`/auth/me`, {
		cache: "no-store",
	});
	if (!response.ok) throw new Error("Not authenticated");
	const data: { user: fullUser } = await response.json();
	return data.user;
}
