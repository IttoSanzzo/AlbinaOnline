import {
	CharacterSkillExpanded,
	SkillData,
	skillNames,
	SkillType,
} from "@/libs/stp@types";
import { NotionGridList } from "@/components/(UTILS)";
import { useLayoutEffect, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { Dialog } from "@/libs/stp@radix";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { NotionToggleHeader } from "@/components/(NotionBased)";

// const ButtonContainer = newStyledElement.div(styles.buttonContainer);

interface SkillSelectionCoreProps {
	characterId: string;
	characterSkills: CharacterSkillExpanded[];
	setCharacterSkills: React.Dispatch<
		React.SetStateAction<CharacterSkillExpanded[]>
	>;
}
export function SkillSelectionCore({
	characterId,
	characterSkills,
	setCharacterSkills,
}: SkillSelectionCoreProps) {
	const [allSkills, setAllSkills] = useState<SkillData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/skills"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllSkills(await response.json());
		});
	}, []);

	if (allSkills.length == 0) return null;
	const unacquiredSkills: SkillData[] = allSkills
		.filter(
			(skill) =>
				!characterSkills.some(
					(characterSkill) => characterSkill.skillId == skill.id
				)
		)
		.sort((skill1, skill2) => {
			const typeOrder = SkillType[skill1.type] - SkillType[skill2.type];
			if (typeOrder !== 0) return typeOrder;
			return skill1.name.localeCompare(skill2.name);
		});
	const unacquiredSkillsByType = Array.from({ length: 5 }, (_, index) =>
		unacquiredSkills.filter((skill) => SkillType[skill.type] === index)
	);

	async function handleAddSkill(skill: SkillData) {
		const body = {
			skillId: skill.id,
		};
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/skills`),
			{
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) return;
		setCharacterSkills((state) => {
			const newSkill: CharacterSkillExpanded = {
				id: "",
				characterId: characterId,
				skillId: skill.id,
				skill: skill,
			};
			const compareFunction = (
				cs1: CharacterSkillExpanded,
				cs2: CharacterSkillExpanded
			) => {
				const typeOrder = SkillType[cs1.skill.type] - SkillType[cs2.skill.type];
				if (typeOrder !== 0) return typeOrder;
				return cs1.skill.name.localeCompare(cs2.skill.name);
			};
			return insertSorted(state, newSkill, compareFunction);
		});
	}

	return (
		<>
			{unacquiredSkillsByType.map((unacquiredSkillFromThisType, index) => {
				if (unacquiredSkillFromThisType.length === 0) return null;
				return (
					<NotionToggleHeader
						key={index}
						memoryId={`${characterId}-AddSkill-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="blue"
						title={skillNames[SkillType[index] as keyof typeof SkillType]}>
						<NotionGridList
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredSkillFromThisType.map((skill) => {
								return (
									<Dialog.Close
										key={skill.id}
										asChild>
										<StyledLinklikeButton
											title={skill.name}
											icon={skill.iconUrl}
											onClick={() => handleAddSkill(skill)}
										/>
									</Dialog.Close>
								);
							})}
						/>
					</NotionToggleHeader>
				);
			})}
		</>
	);
}
