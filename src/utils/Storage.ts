"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function setItem<T>(pathname: string | null, key: string, value: T): void {
	const storageName = pathname ? pathname : "Global";
	localStorage.setItem(`${storageName}-${key}`, String(value));
}
function getItem(pathname: string | null, key: string): string | null {
	const storageName = pathname ? pathname : "Global";
	return localStorage.getItem(`${storageName}-${key}`);
}
function removeItem(pathname: string | null, key: string): void {
	const storageName = pathname ? pathname : "Global";
	localStorage.removeItem(`${storageName}-${key}`);
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

export function useLocalStorageState<T>(
	key: string,
	defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(defaultValue);
	const [loadedKey, setLoadedKey] = useState<string | null>(null);
	useEffect(() => {
		let nextValue = defaultValue;
		const stored = localStorage.getItem(key);
		if (stored !== null) {
			try {
				nextValue = JSON.parse(stored) as T;
			} catch {
				localStorage.removeItem(key);
			}
		}
		setValue(nextValue);
		setLoadedKey(key);
	}, [key]);
	useEffect(() => {
		if (loadedKey !== key) return;
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value, loadedKey]);
	return [value, setValue];
}
export function useSessionStorageState<T>(
	key: string,
	defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(defaultValue);
	const [loadedKey, setLoadedKey] = useState<string | null>(null);
	useEffect(() => {
		let nextValue = defaultValue;
		const stored = sessionStorage.getItem(key);
		if (stored !== null) {
			try {
				nextValue = JSON.parse(stored) as T;
			} catch {
				sessionStorage.removeItem(key);
			}
		}
		setValue(nextValue);
		setLoadedKey(key);
	}, [key]);
	useEffect(() => {
		if (loadedKey !== key) return;
		sessionStorage.setItem(key, JSON.stringify(value));
	}, [key, value, loadedKey]);
	return [value, setValue];
}
