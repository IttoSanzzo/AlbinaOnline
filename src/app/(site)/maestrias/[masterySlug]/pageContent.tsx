import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import MasteryTypologyCallout from "./subComponents/MasteryTypologyCallout";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface MasteryPageContentProps {
	masterySlug: string;
}
export default async function MasteryPageContent({
	masterySlug,
}: MasteryPageContentProps) {
	const MasteryPageData = await getPageData(masterySlug);

	if (MasteryPageData.masteryData == undefined) {
		return null;
	}

	const { masteryData, borderColor } = MasteryPageData;

	return (
		<GenericPageContainer
			title={`⩤Maestria⩥ ${masteryData.name}`}
			banner={masteryData.bannerUrl}
			icon={masteryData.iconUrl}
			borderColor={borderColor}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"mastery"}
				data={masteryData}
			/>

			<UIBasics.Header
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<UIBasics.MultiColumn.Two
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
