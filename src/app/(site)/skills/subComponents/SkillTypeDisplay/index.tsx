import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
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
			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionHeader
					textAlign="center"
					children={title}
				/>
				<NotionGridList
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
			</NotionBox>
		);
	const allSkillsFromThisTypeOrdened: SkillData[] = [];
	subTypesOrder.forEach((subType) => {
		allSkillsFromThisType.forEach((skill) => {
			if (skill.subType === subType) allSkillsFromThisTypeOrdened.push(skill);
		});
	});

	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				textAlign="center"
				children={title}
			/>
			<NotionGridList
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
		</NotionBox>
	);
}
