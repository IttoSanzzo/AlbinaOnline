import type { UseQueryOptions } from "@tanstack/react-query";

export type DataFetchMethod = "GET";

export type DataFetchTransport = "public" | "authenticated";

export type DataFetchQueryKey = readonly [
	"stp@data-fetching",
	DataFetchTransport,
	DataFetchMethod,
	string,
	string | null,
];

export interface DataFetchingQueryMeta extends Record<string, unknown> {
	invalidationKeys: readonly string[];
	transport: DataFetchTransport;
}

export type DataFetchQueryOptions<TData> = Omit<
	UseQueryOptions<TData, Error, TData, DataFetchQueryKey>,
	"queryKey" | "queryFn" | "meta"
>;

export interface DataFetchOptions<TData> {
	url: string;
	method?: DataFetchMethod;
	invalidationKeys?: string | readonly string[];
	cacheKey?: string;
	init?: Omit<RequestInit, "method" | "signal" | "body">;
	parseResponse?: (response: Response) => Promise<TData>;
	queryOptions?: DataFetchQueryOptions<TData>;
}
