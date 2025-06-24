"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function setItem<T>(pathname: string | null, key: string, value: T): void {
	try {
		const storageName = pathname ? pathname : "Global";
		localStorage.setItem(`${storageName}-${key}`, String(value));
	} catch {
		// console.warn("Tried to access localStorage in server.");
	}
}
function getItem(pathname: string | null, key: string): string | null {
	try {
		const storageName = pathname ? pathname : "Global";
		return localStorage.getItem(`${storageName}-${key}`);
	} catch {
		// console.warn("Tried to access localStorage in server.");
		return null;
	}
}
function removeItem(pathname: string | null, key: string): void {
	try {
		const storageName = pathname ? pathname : "Global";
		localStorage.removeItem(`${storageName}-${key}`);
	} catch {
		// console.warn("Tried to access localStorage in server.");
	}
}

export const routeStorage = {
	setItem: <T>(pathname: string, key: string, value: T): void =>
		setItem(pathname, key, value),
	getItem: (pathname: string, key: string): string | null =>
		getItem(pathname, key),
	removeItem: (pathname: string, key: string): void =>
		removeItem(pathname, key),
};

export function useRouteScopedStorage<T>(key: string, defaultValue: T) {
	const pathname = usePathname();
	const fullKey = `${pathname}:${key}`;
	const [value, setValue] = useState<T>(defaultValue);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(fullKey);
		if (stored !== null) {
			try {
				setValue(JSON.parse(stored));
			} catch {
				setValue(defaultValue);
			}
		}
	}, [fullKey]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		localStorage.setItem(fullKey, JSON.stringify(value));
	}, [value, fullKey]);

	return [value, setValue] as const;
}
