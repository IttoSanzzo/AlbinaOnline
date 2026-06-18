import { GenericPageContainer } from "@/components/(Design)";
import { TraitData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import TraitTypeDisplay from "./subComponents/TraitTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Genéricas" },
	{ name: "Comuns" },
	{ name: "Raciais" },
	{ name: "Bençãos" },
	{ name: "Únicas" },
];

export default async function TraitsPageContent() {
	const response = await fetch(getAlbinaApiFullAddress("/traits"), {
		cache: getCacheMode(),
		next: { tags: [`/traits`] },
	});
	const allRawTraits: TraitData[] = await response.json();

	const allTraits: TraitData[] = allRawTraits.sort((a, b) =>
		a.name.localeCompare(b.name),
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
				title="Raciais"
				allTraits={allTraits}
				type="Racial"
			/>
			<TraitTypeDisplay
				title="Talentos"
				allTraits={allTraits}
				type="Talent"
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
