import { StyledLinkWithButton } from "@/components/(Design)";
import { CharacterSkillExpanded, Guid, SkillType } from "@/libs/stp@types";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import React, { useLayoutEffect, useState } from "react";
import { AddSkillButton } from "./subComponents/AddSkillButton";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "..";

async function handleSkillRemoval(
	characterId: Guid,
	skillId: Guid,
	setCharacterSkills: React.Dispatch<
		React.SetStateAction<CharacterSkillExpanded[]>
	>
) {
	const body = { skillId: skillId };
	const toastId = toast.loading(CharToastMessage.loading);
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress(`/chars/${characterId}/skills`),
		{
			method: "DELETE",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (!response.ok) {
		toast.error(CharToastMessage.error, { id: toastId });
		return;
	}
	toast.success(CharToastMessage.success, { id: toastId });
	setCharacterSkills((state) =>
		state.filter((skill) => skill.skill.id != skillId)
	);
}

function formTable(
	characterId: Guid,
	characterSkills: CharacterSkillExpanded[],
	setCharacterSkills: React.Dispatch<
		React.SetStateAction<CharacterSkillExpanded[]>
	>
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
			<StyledLinkWithButton
				buttonIcon={{ name: "TrashIcon", color: "red" }}
				title={characterSkill.skill.name}
				icon={characterSkill.skill.iconUrl}
				href={`/skills/${characterSkill.skill.slug}`}
				onClick={() =>
					handleSkillRemoval(
						characterId,
						characterSkill.skill.id,
						setCharacterSkills
					)
				}
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
			getAlbinaApiFullAddress(`/chars/${characterId}/skills`),
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
		<div style={{ position: "relative" }}>
			<UIBasics.Table
				style={{ margin: 0 }}
				withHeaderColumn={false}
				columnBackgroundColors={["gray"]}
				withHeaderRow
				tableData={{
					tableLanes: formTable(
						characterId,
						characterSkills,
						setCharacterSkills
					),
				}}
			/>
			<AddSkillButton
				characterSkills={characterSkills}
				setCharacterSkills={setCharacterSkills}
				characterId={characterId}
			/>
		</div>
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
