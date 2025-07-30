/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.tsx                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: marcosv2 <marcosv2@student.42.rio>         +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/29 12:55:59 by marcosv2          #+#    #+#             */
/*   Updated: 2025/07/29 15:42:04 by marcosv2         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { CharacterAbilityScore } from "@/libs/stp@types";
import { CharacterDrawerBaseHeader } from "../../../CharacterDrawerBaseHeader";
import {
	Notion2Columns,
	NotionBox,
	NotionTable,
} from "@/components/(NotionBased)";
import { CharacterDataDisplays } from "../CharacterDataDisplays";

interface CharacterStatisticsDisplayProps {
	abilityScore: CharacterAbilityScore;
}
export function CharacterStatisticsDisplay({
	abilityScore,
}: CharacterStatisticsDisplayProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Estatísticas"
			memoryId={`${abilityScore.characterId}-Statistics`}
			backgroundColor="blue">
			<Notion2Columns
				colum1={
					<NotionBox
						backgroundColor="blue"
						withoutPadding
						withoutMargin
						withoutBorder>
						<CharacterDataDisplays.AbilityScore abilityScore={abilityScore} />
					</NotionBox>
				}
				colum2={
					<NotionBox
						backgroundColor="blue"
						withoutPadding
						withoutMargin
						withoutBorder>
						<NotionTable tableData={{ tableLanes: [["a", "b"]] }} />
					</NotionBox>
				}
			/>
		</CharacterDrawerBaseHeader>
	);
}
