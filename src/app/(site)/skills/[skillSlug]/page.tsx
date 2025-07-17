import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { Notion2Columns, NotionHeader } from "@/components/(NotionBased)";
import SkillTypologyCallout from "./subComponents/SkillTypologyCallout";
import SkillPropertiesDisplay from "./subComponents/SkillPropertiesDisplay";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface SkillProps {
	params: Promise<{ skillSlug: string }>;
}

export default async function Skill({ params }: SkillProps) {
	const { skillSlug } = await params;
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

			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<Notion2Columns
				colum1={
					<SkillTypologyCallout
						type={skillData.type}
						subType={skillData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={skillData.info} />}
			/>
			<SkillPropertiesDisplay skillProperties={skillData.properties} />

			<GenericEffectsDisplay effects={skillData.effects} />
			<GenericPageFooter
				version={skillData.albinaVersion}
				lastUpdate={skillData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
