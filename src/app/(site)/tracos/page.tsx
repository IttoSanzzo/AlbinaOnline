import { GenericPageContainer } from "@/components/(Design)";
import { TraitData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import TraitTypeDisplay from "./subComponents/TraitTypeDisplay";

export default async function Items() {
	const response = await fetch(`${process.env.ALBINA_API}/traits`, {
		cache: await getCacheMode(),
	});
	const allRawTraits: TraitData[] = await response.json();

	const allTraits: TraitData[] = allRawTraits.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas as Traits"
			icon={`${process.env.ALBINA_API}/favicon/core-page/traits`}
			banner={`${process.env.ALBINA_API}/banner/core-page/traits`}
			anchors={[
				{ name: "Genéricas", id: "genericas" },
				{ name: "Comuns", id: "comuns" },
				{ name: "Raciais", id: "raciais" },
				{ name: "Únicas", id: "unicas" },
			]}>
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
				title="Únicas"
				allTraits={allTraits}
				type="Unique"
			/>
		</GenericPageContainer>
	);
}
