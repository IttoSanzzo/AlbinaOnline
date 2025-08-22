import {
	CharacterSkillExpanded,
	Guid,
	SkillData,
	skillNames,
	SkillType,
} from "@/libs/stp@types";
import { useLayoutEffect, useMemo, useState } from "react";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { StyledLinklikeButton } from "@/components/(Design)";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { insertSorted } from "@/utils/Data";
import { UIBasics } from "@/components/(UIBasics)";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../../../..";
import { ArraySearchFilter } from "@/components/(UTILS)";

interface SkillSelectionCoreProps {
	characterId: Guid;
	characterSkills: CharacterSkillExpanded[];
	setCharacterSkills: React.Dispatch<
		React.SetStateAction<CharacterSkillExpanded[]>
	>;
	setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
	isInBulkMode: boolean;
}
export function SkillSelectionCore({
	characterId,
	characterSkills,
	setCharacterSkills,
	setOpenState,
	isInBulkMode,
}: SkillSelectionCoreProps) {
	const [allSkills, setAllSkills] = useState<SkillData[]>([]);
	const [selectionPool, setSelectionPool] = useState<SkillData[]>([]);

	useLayoutEffect(() => {
		fetch(getAlbinaApiAddress("/skills"), {
			method: "GET",
			cache: getCacheMode(),
		}).then(async (response) => {
			setAllSkills(await response.json());
		});
	}, []);

	const unacquiredSkills: SkillData[] = useMemo(
		() =>
			allSkills
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
				}),
		[allSkills, characterSkills]
	);
	if (allSkills.length == 0) return null;
	const unacquiredSkillsByType = Array.from({ length: 5 }, (_, index) =>
		selectionPool.filter((skill) => SkillType[skill.type] === index)
	);

	async function handleAddSkill(skill: SkillData) {
		if (isInBulkMode == false) setOpenState(false);
		const body = {
			skillId: skill.id,
		};
		const toastId = toast.loading(CharToastMessage.loading);
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
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setCharacterSkills((state) => {
			const newSkill: CharacterSkillExpanded = {
				id: Guid.Empty,
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
			<ArraySearchFilter
				array={unacquiredSkills}
				setFilteredState={setSelectionPool}
				label="Filtro"
				placeholder="Nome..."
				stringKeysToCheck={["name", "slug"]}
			/>
			{unacquiredSkillsByType.map((unacquiredSkillFromThisType, index) => {
				if (unacquiredSkillFromThisType.length === 0) return null;
				return (
					<UIBasics.ToggleHeader
						defaultOpenState={true}
						key={index}
						memoryId={`${characterId}-AddSkill-Level-${index}`}
						contentMargin="none"
						backgroundColor="darkGray"
						titleAlign="center"
						titleColor="blue"
						title={skillNames[SkillType[index] as keyof typeof SkillType]}>
						<UIBasics.List.Grid
							columnWidth={300}
							direction="column"
							backgroundColor="gray"
							children={unacquiredSkillFromThisType.map((skill) => {
								return (
									<StyledLinklikeButton
										key={skill.id}
										title={skill.name}
										icon={skill.iconUrl}
										onClick={() => handleAddSkill(skill)}
									/>
								);
							})}
						/>
					</UIBasics.ToggleHeader>
				);
			})}
		</>
	);
}
