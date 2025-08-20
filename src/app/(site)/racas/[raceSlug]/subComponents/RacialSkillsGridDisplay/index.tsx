import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { SkillData } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";

interface RacialSkillLinkProps {
	skillSlug: string;
}
export async function RacialSkillLink({ skillSlug }: RacialSkillLinkProps) {
	const response = await fetch(getAlbinaApiAddress(`/skills/${skillSlug}`), {
		method: "GET",
		cache: getCacheMode(),
	});
	if (!response.ok) {
		return (
			<StyledLink
				href={`/skills/${skillSlug}`}
				title={`FAILED: ${skillSlug}`}
				icon={getAlbinaApiAddress(`/favicon/not-found`)}
			/>
		);
	}
	const data: SkillData = await response.json();
	return (
		<StyledLink
			href={`/skills/${skillSlug}`}
			title={data.name}
			icon={data.iconUrl}
		/>
	);
}

interface RacialSkillsGridDisplayProps {
	skillSlugs: string[];
}
export async function RacialSkillsGridDisplay({
	skillSlugs,
}: RacialSkillsGridDisplayProps) {
	return (
		<UIBasics.List.Grid
			children={skillSlugs.map((skillSlug) => (
				<RacialSkillLink
					key={skillSlug}
					skillSlug={skillSlug}
				/>
			))}
		/>
	);
}
