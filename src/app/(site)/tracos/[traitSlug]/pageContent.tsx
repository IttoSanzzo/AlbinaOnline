import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import TraitTypologyCallout from "./subComponents/TraitTypologyCallout";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { LinkedCharacters } from "@/components/(SPECIAL)/components/LinkedCharacters";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface TraitPageContenttProps {
	traitSlug: string;
}

export default async function TraitPageContent({
	traitSlug,
}: TraitPageContenttProps) {
	const TraitPageData = await getPageData(traitSlug);
	if (TraitPageData.traitData == undefined) {
		return <>Error</>;
	}
	const { traitData, borderColor } = TraitPageData;

	return (
		<GenericPageContainer
			title={traitData.name}
			banner={traitData.bannerUrl}
			icon={traitData.iconUrl}
			borderColor={borderColor}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"trait"}
				data={traitData}
			/>

			<UIBasics.Header
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<TraitTypologyCallout
						type={traitData.type}
						subType={traitData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={traitData.info} />}
			/>
			<UIBasics.Callout
				textColor="orange"
				title="Requerimentos:"
				icon={{ name: "Keyhole", color: "orange" }}
				children={traitData.info.requirements.map((requirement, index) => (
					<UIBasics.Quote
						key={index}
						textColor="yellow"
						children={requirement}
					/>
				))}
			/>

			<StaticGallery
				url={getAlbinaApiFullAddress(`/images/traits/${traitData.slug}`)}
				hideIfEmpty
			/>

			<GenericEffectsDisplay effects={traitData.effects} />

			<LinkedCharacters
				endpoint={`/traits/by-id/${traitData.id}/linked-characters`}
			/>

			<GenericPageFooter
				version={traitData.albinaVersion}
				lastUpdate={traitData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
