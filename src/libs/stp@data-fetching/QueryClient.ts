"use client";

import { QueryClient } from "@tanstack/react-query";

export const dataFetchingQueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			gcTime: 5 * 60 * 1000,
		},
	},
});
