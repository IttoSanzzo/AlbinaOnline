import { FullUser } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "./AlbinaApi";

export async function authenticatedFetchAsync(
	input: RequestInfo | URL,
	init: RequestInit = {},
): Promise<Response> {
	const url =
		typeof input === "string" || input instanceof URL
			? input.toString().startsWith("http")
				? input.toString()
				: `${getAlbinaApiFullAddress()}${input.toString()}`
			: input;

	const requestInit: RequestInit = {
		...init,
		credentials: "include",
	};

	const response = await fetch(url, requestInit);

	if (response.status !== 401) return response;

	const refreshed = await tryRefresh();
	if (!refreshed) return response;

	return await fetch(url, requestInit);
}

let refreshingLock: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
	if (!refreshingLock) {
		refreshingLock = fetch(`${getAlbinaApiFullAddress()}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		})
			.then((response) => {
				if (response.status === 200) return true;

				if (typeof window !== "undefined") {
					const loginPageLink = `/login?redirectTo=${window.location.pathname}`;
					window.location.href = loginPageLink;
				}

				return false;
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
	const data: { user: FullUser } = await response.json();
	return data.user;
}
