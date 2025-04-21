export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffectContent = {
	type: string;
	value: string;
};

export type GenericEffect = {
	id: number;
	role: string;
	contents: GenericEffectContent[];
};

export type MasteryData = {
	id: number;
	slug: string;
	type: string;
	albinaVersion: string;
	data: {
		name: string;
		category: string;
		iconUrl: string;
		info: GenericInfo;
		effects: GenericEffect[];
	};
};

type GetDataError = {
	message: string;
};

type MasteryPageData = {
	masteryData?: MasteryData;
};

export async function getPageData(
	masterySlug: string
): Promise<MasteryPageData> {
	if (!masterySlug) return { masteryData: undefined };

	const response = await fetch(
		`${process.env.ALBINA_API}/maestrias/${masterySlug}`,
		{
			cache: "force-cache",
		}
	);
	if (!response.ok) return { masteryData: undefined };
	const masteryData: MasteryData = await response.json();

	return { masteryData };
}
