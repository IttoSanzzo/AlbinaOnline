import { getCacheMode } from "./Cache";
import { pascalToCamel } from "./StringUtils";

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
	const response = await fetch(`${process.env.ALBINA_API}/${endpoint}`, {
		cache: await getCacheMode(),
	});
	if (!response.ok) return [];
	const data: { slug: string }[] = await response.json();
	const key = SlugKeyMap[endpoint];
	return data.map((paramData) => ({
		[key]: paramData.slug,
	})) as { [P in SlugMap[K]]: string }[];
}
