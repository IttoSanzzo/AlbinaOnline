import { SelectOption } from "@/libs/stp@forms";
import { getAlbinaApiFullAddress } from "./AlbinaApi";
import { getCacheMode } from "./Cache";
import { pascalToCamel } from "./StringUtils";
import { LintIgnoredAny } from "@/libs/stp@types";

export function convertEnumsFromResponse<T>(data: T): T {
	if (Array.isArray(data)) {
		return data.map(convertEnumsFromResponse) as unknown as T;
	} else if (typeof data == "object" && data !== null) {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			if (key === "color" && typeof value === "string")
				result[key] = pascalToCamel(value);
			else result[key] = convertEnumsFromResponse(value);
		}
		return result as T;
	}
	return data;
}

const SlugKeyMap = {
	skills: "skillSlug",
	races: "raceSlug",
	items: "itemSlug",
	masteries: "masterySlug",
	traits: "traitSlug",
	spells: "spellSlug",
} as const;
type SlugMap = typeof SlugKeyMap;

export async function fetchStaticParamSlugs<K extends keyof SlugMap>(
	endpoint: K
): Promise<{ [P in SlugMap[K]]: string }[]> {
	const response = await fetch(getAlbinaApiFullAddress(`/${endpoint}`), {
		cache: getCacheMode(),
	});
	if (!response.ok) return [];
	const data: { slug: string }[] = await response.json();
	const key = SlugKeyMap[endpoint];
	return data.map((paramData) => ({
		[key]: paramData.slug,
	})) as { [P in SlugMap[K]]: string }[];
}

export function shallowCompare<T extends object>(a: T, b: T): boolean {
	if (a === b) return true;

	const aKeys = Object.keys(a) as (keyof T)[];
	const bKeys = Object.keys(b) as (keyof T)[];

	if (aKeys.length !== bKeys.length) return false;

	for (const key of aKeys) {
		if (a[key] !== b[key]) return false;
	}

	return true;
}

export function deepCompare(a: LintIgnoredAny, b: LintIgnoredAny): boolean {
	if (a === b) return true;

	if (typeof a !== typeof b) return false;
	if (a == null || b == null) return false;

	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!deepCompare(a[i], b[i])) return false;
		}
		return true;
	}

	if (typeof a === "object" && typeof b === "object") {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);
		if (aKeys.length !== bKeys.length) return false;
		for (const key of aKeys) {
			if (!deepCompare(a[key], b[key])) return false;
		}
		return true;
	}

	return false;
}

export function insertSorted<T>(
	array: T[],
	item: T,
	compareFn: (a: T, b: T) => number
): T[] {
	let left = 0;
	let right = array.length;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		if (compareFn(item, array[mid]) < 0) {
			right = mid;
		} else {
			left = mid + 1;
		}
	}

	const newArray = [...array];
	newArray.splice(left, 0, item);
	return newArray;
}

export function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
	return (value: T) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
}

export function enumToSelectOptions<T extends Record<string, string | number>>(
	targetEnum: T,
	ignoredKeys?: (keyof T)[]
): SelectOption[] {
	if (ignoredKeys) {
		return Object.entries(targetEnum)
			.filter(([key]) => isNaN(Number(key)) && !ignoredKeys.includes(key))
			.sort(([key1], [key2]) => key1.localeCompare(key2))
			.map(([key, value]) => ({
				name: key,
				value: value as number,
			}));
	}
	return Object.entries(targetEnum)
		.filter(([key]) => isNaN(Number(key)))
		.sort(([key1], [key2]) => key1.localeCompare(key2))
		.map(([key, value]) => ({
			name: key,
			value: value as number,
		}));
}
