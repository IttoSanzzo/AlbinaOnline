import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import SkillTypologyCallout from "./subComponents/SkillTypologyCallout";
import SkillPropertiesDisplay from "./subComponents/SkillPropertiesDisplay";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";
import { LinkedCharacters } from "@/components/(SPECIAL)/components/LinkedCharacters";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface SkillPageContentProps {
	skillSlug: string;
}

export default async function SkillPageContent({
	skillSlug,
}: SkillPageContentProps) {
	const SkillPageData = await getPageData(skillSlug);
	if (SkillPageData.skillData == undefined) {
		return <>Error</>;
	}
	const { skillData, borderColor } = SkillPageData;

	return (
		<GenericPageContainer
			title={skillData.name}
			banner={skillData.bannerUrl}
			icon={skillData.iconUrl}
			borderColor={borderColor}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"skill"}
				data={skillData}
			/>

			<UIBasics.Header
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<UIBasics.MultiColumn.Two
				colum1={
					<SkillTypologyCallout
						type={skillData.type}
						subType={skillData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={skillData.info} />}
			/>
			<SkillPropertiesDisplay skillProperties={skillData.properties} />

			<StaticGallery
				url={getAlbinaApiFullAddress(`/images/skills/${skillData.slug}`)}
				hideIfEmpty
			/>

			<GenericEffectsDisplay effects={skillData.effects} />

			<LinkedCharacters
				endpoint={`/skills/by-id/${skillData.id}/linked-characters`}
			/>

			<GenericPageFooter
				version={skillData.albinaVersion}
				lastUpdate={skillData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
