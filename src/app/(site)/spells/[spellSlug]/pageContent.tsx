import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import SpellTypologyCallout from "./subComponents/SpellTypologyCallout";
import SpellPropertiesDisplay from "./subComponents/SpellPropertiesDisplay";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface SpellPageContentProps {
	spellSlug: string;
}
export default async function SpellPageContent({
	spellSlug,
}: SpellPageContentProps) {
	const SpellPageData = await getPageData(spellSlug);
	if (SpellPageData.spellData == undefined) {
		return <>Error</>;
	}
	const { spellData, borderColor } = SpellPageData;

	return (
		<GenericPageContainer
			title={spellData.name}
			banner={spellData.bannerUrl}
			icon={spellData.iconUrl}
			borderColor={borderColor}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"spell"}
				data={spellData}
			/>

			<UIBasics.Header
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<SpellTypologyCallout
						type={spellData.type}
						subType={spellData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={spellData.info} />}
			/>

			<SpellPropertiesDisplay
				spellProperties={spellData.properties}
				magicAttributes={spellData.magicAttributes}
				spellDomains={spellData.spellDomains}
				spellLevel={spellData.domainLevel}
			/>

			<GenericEffectsDisplay effects={spellData.effects} />
			<GenericPageFooter
				version={spellData.albinaVersion}
				lastUpdate={spellData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
