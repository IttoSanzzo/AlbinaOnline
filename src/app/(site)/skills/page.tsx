import { GenericPageContainer } from "@/components/(Design)";
import { SkillData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import SkillTypeDisplay from "./subComponents/SkillTypeDisplay";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Genéricas", id: "genericas" },
	{ name: "Comuns", id: "comuns" },
	{ name: "Raciais", id: "raciais" },
	{ name: "Únicas", id: "unicas" },
];

export default async function SkillsPage() {
	const response = await fetch(`${process.env.ALBINA_API}/skills`, {
		cache: getCacheMode(),
	});
	const allRawSkills: SkillData[] = await response.json();

	const allSkills: SkillData[] = allRawSkills.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas as Skills"
			icon={getAlbinaApiAddress("/favicon/core-page/skills")}
			banner={getAlbinaApiAddress("/banner/core-page/skills")}>
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<SkillTypeDisplay
				title="Genéricas"
				allSkills={allSkills}
				type="Generic"
			/>
			<SkillTypeDisplay
				title="Comuns"
				allSkills={allSkills}
				type="Common"
			/>
			<SkillTypeDisplay
				title="Raciais"
				allSkills={allSkills}
				type="Racial"
			/>
			<SkillTypeDisplay
				title="Únicas"
				allSkills={allSkills}
				type="Unique"
			/>
		</GenericPageContainer>
	);
}
