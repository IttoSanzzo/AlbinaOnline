import { CharacterFullData, ItemData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";

type CharacterPageData = {
	characterData?: CharacterFullData;
	borderColor: string;
};

export async function getPageData(
	characterId: string
): Promise<CharacterPageData> {
	if (!characterId) return { characterData: undefined, borderColor: "" };

	const response = await fetch(
		`${process.env.ALBINA_API}/chars/${characterId}/full`,
		{
			cache: await getCacheMode(),
		}
	);
	if (!response.ok) return { characterData: undefined, borderColor: "" };
	const characterData = convertEnumsFromResponse<CharacterFullData>(
		await response.json()
	);

	return {
		characterData,
		borderColor: "",
	};
}
