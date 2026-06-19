import { useRef, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
) {
	const timeoutRef = useRef<number | null>(null);

	if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
	return useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = window.setTimeout(() => {
				fn(...args);
			}, delay);
		},
		[fn, delay],
	);
}

export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	return (...args: Parameters<T>) => {
		if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => fn(...args), delay);
	};
}
