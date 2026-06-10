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
			{traitData.properties.requirements.length !== 0 && (
				<UIBasics.Table
					id="requirements"
					withHeaderRow
					textColor="gray"
					fixedLinePositions={[1]}
					fixedLineWidths={[25]}
					tableData={{
						tableLanes: [
							[
								<UIBasics.Text
									textColor="orange"
									children="Requerimentos"
								/>,
								<UIBasics.Text
									textColor="orange"
									children="Descrição"
									textAlign="flex-center"
									withBold
								/>,
							],
							...traitData.properties.requirements.map((requirement) => [
								<UIBasics.Text>{`⦇ ${requirement.key} ⦈`}</UIBasics.Text>,
								<UIBasics.Text>{`⪩ ${requirement.value}`}</UIBasics.Text>,
							]),
						],
					}}
				/>
			)}
			<StaticGallery
				url={getAlbinaApiFullAddress(`/images/traits/${traitData.slug}`)}
				hideIfEmpty
			/>
			<GenericEffectsDisplay
				effects={traitData.effects}
				preAnchors={[
					{
						name: "¤ Especificações ¤",
					},
					{
						name: "¤ Requerimentos ¤",
						id: "requirements",
					},
					{
						name: "Galeria",
					},
				]}
				postAnchors={[
					{
						name: "Personagens Relacionados",
					},
				]}
			/>
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
