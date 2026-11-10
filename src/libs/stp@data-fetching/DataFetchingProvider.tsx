"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { dataFetchingQueryClient } from "./QueryClient";

interface DataFetchingProviderProps {
	children: ReactNode;
}

export function DataFetchingProvider({ children }: DataFetchingProviderProps) {
	return (
		<QueryClientProvider client={dataFetchingQueryClient}>
			{children}
		</QueryClientProvider>
	);
}
