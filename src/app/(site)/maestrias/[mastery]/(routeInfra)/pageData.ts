export type GenericInfo = {
	summary: string[];
	description: string[];
	miscellaneous: string[];
};

export type GenericEffect = {
	name: string;
	info: string[];
};

export type MasteryData = {
	id: number;
	slug: string;
	type: string;
	creationDate: string;
	lastUpdate: string;
	albinaVersion: string;
	data: {
		name: string;
		status: string;
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
