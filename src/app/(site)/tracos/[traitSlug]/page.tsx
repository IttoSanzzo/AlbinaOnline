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

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface TraitProps {
	params: Promise<{ traitSlug: string }>;
}

export default async function Trait({ params }: TraitProps) {
	const { traitSlug } = await params;
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
			<GenericEffectsDisplay effects={traitData.effects} />
			<GenericPageFooter
				version={traitData.albinaVersion}
				lastUpdate={traitData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
