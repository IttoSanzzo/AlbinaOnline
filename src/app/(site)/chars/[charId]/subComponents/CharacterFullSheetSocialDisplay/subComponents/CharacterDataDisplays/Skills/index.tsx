import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { CharacterSkillExpanded, Guid, SkillType } from "@/libs/stp@types";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";

function formTable(
	characterSkills: CharacterSkillExpanded[]
): React.JSX.Element[][] {
	const titleRow = [
		<UIBasics.Text
			textColor="gray"
			children="Nome"
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
			<StyledLink
				title={characterSkill.skill.name}
				icon={characterSkill.skill.iconUrl}
				href={`/skills/${characterSkill.skill.slug}`}
			/>,
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
			getAlbinaApiAddress(`/chars/${characterId}/skills`),
			{
				method: "GET",
			}
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
		<UIBasics.Table
			style={{ margin: 0 }}
			withHeaderColumn={false}
			columnBackgroundColors={["gray"]}
			withHeaderRow
			tableData={{
				tableLanes: formTable(characterSkills),
			}}
		/>
	);
}

function areEqual(
	prevProps: CharacterSkillsDisplayProps,
	nextProps: CharacterSkillsDisplayProps
) {
	return prevProps.characterId === nextProps.characterId;
}
export const CharacterSkillsDisplay = React.memo(
	_CharacterSkillsDisplay,
	areEqual
);
