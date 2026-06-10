import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSkillExpanded, Guid, SkillType } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterSkills: CharacterSkillExpanded[],
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Skills"
		/>,
	];
	if (characterSkills.length == 0) {
		return [
			titleRow,
			[
				<UIBasics.Text
					textColor="orange"
					children="-"
				/>,
			],
		];
	}
	return [
		titleRow,
		...characterSkills.map((characterSkill) => [
			(characterSkill.notes ?? "").length > 0 ? (
				<UIBasics.Toggle
					floatingReverseButton
					withoutPadding
					contentMargin="none"
					textColor="gray"
					memoryId={`${characterSkill.characterId}-skills-${characterSkill.skillId}-notes`}
					title={
						<StyledLink
							title={characterSkill.skill.name}
							icon={characterSkill.skill.iconUrl}
							href={`/skills/${characterSkill.skill.slug}`}
							style={{ width: "100%" }}
						/>
					}>
					<p
						style={{
							border: "5px solid var(--cl-gray-800)",
							borderTop: 0,
							borderBottomLeftRadius: "var(--rd-md)",
							borderBottomRightRadius: "var(--rd-md)",
							padding: "var(--sp-1) var(--sp-3)",
							display: "block",
							whiteSpace: "pre-wrap",
						}}>
						{characterSkill.notes}
					</p>
				</UIBasics.Toggle>
			) : (
				<StyledLink
					title={characterSkill.skill.name}
					icon={characterSkill.skill.iconUrl}
					href={`/skills/${characterSkill.skill.slug}`}
				/>
			),
		]),
	];
}

interface CharacterSkillsDisplayProps {
	characterId: Guid;
}
export function _CharacterSkillsDisplay({
	characterId,
}: CharacterSkillsDisplayProps) {
	const [characterSkills, setCharacterSkills] = useState<
		CharacterSkillExpanded[]
	>([]);

	useLayoutEffect(() => {
		authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/chars/${characterId}/skills`),
			{
				method: "GET",
				next: { tags: [`/chars/${characterId}`] },
			},
		).then(async (response) => {
			if (!response.ok) return;
			const sortedSkills: CharacterSkillExpanded[] = (
				(await response.json()) as CharacterSkillExpanded[]
			).sort((cs1, cs2) => {
				const typeOrder = SkillType[cs1.skill.type] - SkillType[cs2.skill.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.skill.name.localeCompare(cs2.skill.name);
			});
			setCharacterSkills(sortedSkills);
		});
	}, []);

	return (
		<div>
			<UIBasics.Table
				style={{ margin: 0 }}
				withHeaderColumn={false}
				columnBackgroundColors={["gray"]}
				withHeaderRow
				tableData={{
					tableLanes: formTable(characterSkills),
				}}
			/>
		</div>
	);
}

export const CharacterSkillsDisplay = React.memo(_CharacterSkillsDisplay);
