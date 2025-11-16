import { GenericPageContainer } from "@/components/(Design)";
import { TraitData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import TraitTypeDisplay from "./subComponents/TraitTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Genéricas", id: "genericas" },
	{ name: "Comuns", id: "comuns" },
	{ name: "Raciais", id: "raciais" },
	{ name: "Únicas", id: "unicas" },
];

export default async function TraitsPageContent() {
	const response = await fetch(getAlbinaApiFullAddress("/traits"), {
		cache: getCacheMode(),
	});
	const allRawTraits: TraitData[] = await response.json();

	const allTraits: TraitData[] = allRawTraits.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas as Traits"
			icon={getAlbinaApiFullAddress("/favicon/core-page/traits")}
			banner={getAlbinaApiFullAddress("/banner/core-page/traits")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<TraitTypeDisplay
				title="Genéricas"
				allTraits={allTraits}
				type="Generic"
			/>
			<TraitTypeDisplay
				title="Comuns"
				allTraits={allTraits}
				type="Common"
			/>
			<TraitTypeDisplay
				title="Raciais"
				allTraits={allTraits}
				type="Racial"
			/>
			<TraitTypeDisplay
				title="Bençãos"
				allTraits={allTraits}
				type="Blessing"
			/>
			<TraitTypeDisplay
				title="Únicas"
				allTraits={allTraits}
				type="Unique"
			/>
		</GenericPageContainer>
	);
}
