import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import {
	Notion2Columns,
	NotionCallout,
	NotionHeader,
	NotionQuote,
} from "@/components/(NotionBased)";
import TraitTypologyCallout from "./subComponents/TraitTypologyCallout";
import { SetCurrentPageData } from "@/components/(UTILS)/components/SetCurrentPageData";

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
			<SetCurrentPageData
				type={"Trait"}
				data={traitData}
			/>

			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<Notion2Columns
				colum1={
					<TraitTypologyCallout
						type={traitData.type}
						subType={traitData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={traitData.info} />}
			/>
			<NotionCallout
				textColor="orange"
				title="Requerimentos:"
				icon={{ name: "Keyhole", color: "orange" }}
				children={traitData.info.requirements.map((requirement, index) => (
					<NotionQuote
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
