import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import {
	DataFetchMethod,
	DataFetchQueryKey,
	DataFetchTransport,
} from "./Types";

export class DataFetchHttpError extends Error {
	public readonly status: number;
	public readonly statusText: string;
	public readonly response: Response;

	constructor(response: Response) {
		super(`Fetch failed: ${response.status} ${response.statusText}`);

		this.name = "DataFetchHttpError";
		this.status = response.status;
		this.statusText = response.statusText;
		this.response = response;
	}
}

export function normalizeInvalidationKeys(
	keys?: string | readonly string[],
): string[] {
	if (!keys) return [];

	const normalized = typeof keys === "string" ? [keys] : keys;

	return [...new Set(normalized.filter((key) => key.length > 0))];
}

export function createDataFetchQueryKey(
	transport: DataFetchTransport,
	method: DataFetchMethod,
	url: string,
	cacheKey?: string,
): DataFetchQueryKey {
	return ["stp@data-fetching", transport, method, url, cacheKey ?? null];
}

function resolvePublicUrl(url: string): string {
	if (/^https?:\/\//i.test(url)) return url;

	return getAlbinaApiFullAddress(url);
}

interface ExecuteDataFetchOptions<TData> {
	transport: DataFetchTransport;
	url: string;
	method: DataFetchMethod;
	init?: Omit<RequestInit, "method" | "signal" | "body">;
	signal: AbortSignal;
	parseResponse?: (response: Response) => Promise<TData>;
}

export async function executeDataFetch<TData>({
	transport,
	url,
	method,
	init,
	signal,
	parseResponse,
}: ExecuteDataFetchOptions<TData>): Promise<TData> {
	const requestInit: RequestInit = {
		...init,
		method,
		signal,
	};

	const response =
		transport === "authenticated"
			? await authenticatedFetchAsync(url, requestInit)
			: await fetch(resolvePublicUrl(url), requestInit);

	if (!response.ok) {
		throw new DataFetchHttpError(response);
	}

	if (response.status === 204 || response.status === 205) {
		return undefined as TData;
	}

	if (parseResponse) {
		return await parseResponse(response);
	}

	return (await response.json()) as TData;
}
