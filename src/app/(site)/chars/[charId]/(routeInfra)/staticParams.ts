import { fetchStaticParamSlugs } from "@/utils/Data";

export async function generateStaticParams() {
	if (process.env.NODE_ENV === "development") return [];
	// return await fetchStaticParamSlugs("items");
	return [];
}
