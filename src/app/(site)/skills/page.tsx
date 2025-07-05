import { GenericPageContainer } from "@/components/(Design)";
import { SkillData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import SkillTypeDisplay from "./subComponents/SkillTypeDisplay";

export default async function Items() {
	const response = await fetch(`${process.env.ALBINA_API}/skills`, {
		cache: await getCacheMode(),
	});
	const allRawSkills: SkillData[] = await response.json();

	const allSkills: SkillData[] = allRawSkills.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer
			title="Todas as Skills"
			icon={`${process.env.ALBINA_API}/favicon/core-page/skills`}
			banner={`${process.env.ALBINA_API}/banner/core-page/skills`}
			anchors={[
				{ name: "Genéricas", id: "genericas" },
				{ name: "Comuns", id: "comuns" },
				{ name: "Raciais", id: "raciais" },
				{ name: "Únicas", id: "unicas" },
			]}>
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
