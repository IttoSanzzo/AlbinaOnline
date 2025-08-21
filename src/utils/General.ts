import { useRef, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number
) {
	const timeoutRef = useRef<number | null>(null);

	if (timeoutRef.current !== null) {
		clearTimeout(timeoutRef.current);
	}
	const debouncedFn = useCallback(
		(...args: Parameters<T>) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = window.setTimeout(() => {
				fn(...args);
			}, delay);
		},
		[fn, delay]
	);

	return debouncedFn;
}

export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number
) {
	let timer: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}
