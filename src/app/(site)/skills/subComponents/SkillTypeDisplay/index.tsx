import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { SkillData } from "@/libs/stp@types";

interface SkillTypeDisplayProps {
	allSkills: SkillData[];
	type: string;
	subTypesOrder?: string[];
	title: string;
}

export default function SkillTypeDisplay({
	allSkills,
	type,
	subTypesOrder,
	title,
}: SkillTypeDisplayProps) {
	const allSkillsFromThisType = allSkills.filter(
		(skill) => skill.type === type
	);

	if (!subTypesOrder)
		return (
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textAlign="center"
					children={title}
				/>
				<UIBasics.List.Grid
					backgroundColor="purple"
					children={allSkillsFromThisType.map((skill) => {
						return (
							<StyledLink
								key={skill.id}
								title={skill.name}
								href={`skills/${skill.slug}`}
								icon={skill.iconUrl}
							/>
						);
					})}
				/>
			</UIBasics.Box>
		);
	const allSkillsFromThisTypeOrdened: SkillData[] = [];
	subTypesOrder.forEach((subType) => {
		allSkillsFromThisType.forEach((skill) => {
			if (skill.subType === subType) allSkillsFromThisTypeOrdened.push(skill);
		});
	});

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				textAlign="center"
				children={title}
			/>
			<UIBasics.List.Grid
				backgroundColor="purple"
				children={allSkillsFromThisTypeOrdened.map((skill) => {
					return (
						<StyledLink
							key={skill.id}
							title={skill.name}
							href={`skills/${skill.slug}`}
							icon={skill.iconUrl}
						/>
					);
				})}
			/>
		</UIBasics.Box>
	);
}
