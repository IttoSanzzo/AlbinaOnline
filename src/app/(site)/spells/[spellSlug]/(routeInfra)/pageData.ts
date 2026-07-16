import { Guid, SpellData } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";
import { AutoMinedSpellDataMap } from "../../../../../../Data/GitIgnored/AutoMinedSpellData";
import { normalizeDiacriticText } from "@/utils/StringUtils";

type SpellPageData = {
	spellData?: SpellData;
	borderColor: string;
};

function getSubTypeBorderColor(subType: string): string {
	switch (subType) {
		default:
			return "";
	}
}

export async function getPageData(spellSlug: string): Promise<SpellPageData> {
	if (!spellSlug) return { spellData: undefined, borderColor: "" };

	const response = await fetch(
		getAlbinaApiFullAddress(`/spells/${spellSlug}`),
		{
			cache: getCacheMode(),
			next: { tags: [`/spells`, "/effects"] },
		},
	);
	if (!response.ok) return { spellData: undefined, borderColor: "" };
	const spellData = convertEnumsFromResponse<SpellData>(await response.json());

	overloadDataWithMined(spellData);

	return {
		spellData,
		borderColor: getSubTypeBorderColor(spellData.subType),
	};
}

function overloadDataWithMined(spellData: SpellData) {
	if (!spellData.name.startsWith("@ ")) return;

	const subName = spellData.name.substring(2);

	const normalizedName = normalizeDiacriticText(subName);
	const minedData = AutoMinedSpellDataMap.get(normalizedName);
	if (!minedData) return;

	spellData.name = subName;
	spellData.info.miscellaneous.push(`⛏️ Tipo ${minedData.type}`);
	spellData.info.miscellaneous.push(`⛏️ Level ${minedData.level}`);

	try {
		spellData.properties!.extras.push({
			key: "AS",
			value: `⛏️ ${minedData.components}`,
		});
	} catch (ex) {
		void ex;
	}
	try {
		if (spellData.properties!.components.duration == "")
			spellData.properties!.components.duration = `⛏️ ${minedData.duration}`;
	} catch (ex) {
		void ex;
	}
	try {
		if (spellData.properties!.components.range == "")
			spellData.properties!.components.range = `⛏️ ${minedData.range}`;
	} catch (ex) {
		void ex;
	}
	try {
		if (spellData.properties!.components.time == "")
			spellData.properties!.components.time = `⛏️ ${minedData.castTime}`;
	} catch (ex) {
		void ex;
	}

	try {
		spellData.effects.push({
			id: Guid.NewGuid(),
			effectLinkId: "00000000-0000-0000-0000-000000000000",
			name: subName,
			role: "⛏️",
			color: "yellow",
			order: spellData.effects.length + 1,
			contents: [
				{
					type: "Text",
					value: minedData.description.join("\n\n"),
					color: "gray",
				},
			],
		});
	} catch (ex) {
		void ex;
	}
}
