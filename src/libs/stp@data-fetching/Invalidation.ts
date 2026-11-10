import { dataFetchingQueryClient } from "./QueryClient";
import { DataFetchingQueryMeta } from "./Types";

export type FetchInvalidationRefetchType =
	| "active"
	| "inactive"
	| "all"
	| "none";

export interface InvalidateFetchesOptions {
	refetchType?: FetchInvalidationRefetchType;
	cancelRefetch?: boolean;
	throwOnError?: boolean;
}

export async function invalidateFetches(
	keys: string | readonly string[],
	options: InvalidateFetchesOptions = {},
): Promise<void> {
	const normalizedKeys = new Set(
		(typeof keys === "string" ? [keys] : keys).filter((key) => key.length > 0),
	);

	if (normalizedKeys.size === 0) return;

	await dataFetchingQueryClient.invalidateQueries(
		{
			predicate: (query) => {
				const meta = query.meta as DataFetchingQueryMeta | undefined;

				return (
					meta?.invalidationKeys?.some((key) => normalizedKeys.has(key)) ??
					false
				);
			},
			refetchType: options.refetchType ?? "active",
		},
		{
			cancelRefetch: options.cancelRefetch ?? true,
			throwOnError: options.throwOnError ?? false,
		},
	);
}
