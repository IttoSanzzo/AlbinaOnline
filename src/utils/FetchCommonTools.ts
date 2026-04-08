import { LintIgnoredAny } from "@/libs/stp@types";
import { authenticatedFetchAsync } from "./FetchClientTools";

type CachedResponse<T> = {
	data: T;
	status: number;
	ok: boolean;
	expiresAt: number;
};

const globalCache =
	(globalThis as LintIgnoredAny).__albinaCache ??
	((globalThis as LintIgnoredAny).__albinaCache = new Map<
		string,
		CachedResponse<LintIgnoredAny>
	>());

export async function fetchWithTTLCache<T = LintIgnoredAny>(
	input: string,
	init?: RequestInit,
	ttlMs: number = 1000,
): Promise<CachedResponse<T>> {
	const key = `fetchWithTTLCache|${input}|${JSON.stringify(init ?? {})}`;
	const now = Date.now();
	const cached = globalCache.get(key);

	if (cached && cached.ok && cached.expiresAt > now) return cached;

	const response = await fetch(input, init);
	const data = await response.json();
	const entry: CachedResponse<T> = {
		data: data,
		status: response.status,
		ok: response.ok,
		expiresAt: now + ttlMs,
	};
	globalCache.set(key, entry);
	return entry;
}

export async function authenticatedFetchWithTTLCache<T = LintIgnoredAny>(
	input: string,
	init?: RequestInit,
	ttlMs: number = 1000,
): Promise<CachedResponse<T>> {
	const key = `fetchWithTTLCache|${input}|${JSON.stringify(init ?? {})}`;
	const now = Date.now();
	const cached = globalCache.get(key);

	if (cached && cached.ok && cached.expiresAt > now) return cached;

	const response = await authenticatedFetchAsync(input, init);
	const data = response.status != 404 ? await response.json() : null;
	const entry: CachedResponse<T> = {
		data: data,
		status: response.status,
		ok: response.ok,
		expiresAt: now + ttlMs,
	};
	globalCache.set(key, entry);
	return entry;
}
