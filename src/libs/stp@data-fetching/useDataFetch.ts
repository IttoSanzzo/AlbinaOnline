"use client";

import { useQuery } from "@tanstack/react-query";
import {
	createDataFetchQueryKey,
	executeDataFetch,
	normalizeInvalidationKeys,
} from "./FetchRequest";
import {
	DataFetchOptions,
	DataFetchQueryKey,
	DataFetchTransport,
} from "./Types";

export function useDataFetch<TData>(
	options: DataFetchOptions<TData>,
	transport: DataFetchTransport,
) {
	const {
		url,
		method = "GET",
		invalidationKeys,
		cacheKey,
		init,
		parseResponse,
		queryOptions,
	} = options;

	const normalizedInvalidationKeys =
		normalizeInvalidationKeys(invalidationKeys);

	const queryKey = createDataFetchQueryKey(transport, method, url, cacheKey);

	return useQuery<TData, Error, TData, DataFetchQueryKey>({
		...queryOptions,
		queryKey,
		queryFn: ({ signal }) =>
			executeDataFetch<TData>({
				transport,
				url,
				method,
				init,
				signal,
				parseResponse,
			}),
		meta: {
			invalidationKeys: normalizedInvalidationKeys,
			transport,
		},
	});
}

export function useFetch<TData = unknown>(options: DataFetchOptions<TData>) {
	return useDataFetch<TData>(options, "public");
}

export function useAuthenticatedFetch<TData = unknown>(
	options: DataFetchOptions<TData>,
) {
	return useDataFetch<TData>(options, "authenticated");
}
