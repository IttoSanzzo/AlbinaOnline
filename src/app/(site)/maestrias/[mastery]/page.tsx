import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { NotionHeader, Notion2Columns } from "@/components/(NotionBased)";
import { getPageData } from "./(routeInfra)";
import MasteryTypologyCallout from "./subComponents/TypologyCallout";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface MasteryProps {
	params: Promise<{ mastery: string }>;
}

export default async function Mastery({ params }: MasteryProps) {
	const { mastery } = await params;
	const MasteryPageData = await getPageData(mastery);
	if (MasteryPageData.masteryData == undefined) {
		return <></>;
	}
	const { masteryData } = MasteryPageData;

	return (
		<GenericPageContainer
			title={`⩤Maestria⩥ ${masteryData.data.name}`}
			banner={AlbinaLogo}
			favicon={masteryData.data.iconUrl}>
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
						category={masteryData.data.category}
					/>
				}
				colum2={<GenericInfoCallout info={masteryData.data.info} />}
			/>
			<GenericEffectsDisplay effects={masteryData.data.effects} />
			<GenericPageFooter version={masteryData.albinaVersion} />
		</GenericPageContainer>
	);
}
