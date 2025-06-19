import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { NotionHeader, Notion2Columns } from "@/components/(NotionBased)";
import { getPageData } from "./(routeInfra)";
import MasteryTypologyCallout from "./subComponents/MasteryTypologyCallout";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface MasteryProps {
	params: Promise<{ masterySlug: string }>;
}

export default async function Mastery({ params }: MasteryProps) {
	const { masterySlug } = await params;
	const MasteryPageData = await getPageData(masterySlug);
	if (MasteryPageData.masteryData == undefined) {
		return <></>;
	}
	const { masteryData, borderColor } = MasteryPageData;

	return (
		<GenericPageContainer
			title={`⩤Maestria⩥ ${masteryData.name}`}
			banner={AlbinaLogo}
			icon={masteryData.iconUrl}
			borderColor={borderColor}>
			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<Notion2Columns
				colum1={
					<MasteryTypologyCallout
						type={masteryData.type}
						subType={masteryData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={masteryData.info} />}
			/>
			<GenericEffectsDisplay effects={masteryData.effects} />
			<GenericPageFooter
				version={masteryData.albinaVersion}
				lastUpdate={masteryData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
