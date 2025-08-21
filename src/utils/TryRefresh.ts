"use client";

import { getAlbinaApiAddress } from "./AlbinaApi";

export async function tryRefresh() {
	try {
		const response = await fetch(`${getAlbinaApiAddress()}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
			credentials: "include",
		});
		if (response.status != 200) return { status: response.status };
		const data = await response.json();
		return { ...data, status: response.status };
	} catch {
		return { status: 500 };
	}
}
