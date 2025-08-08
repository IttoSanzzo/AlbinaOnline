import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterActionPool, Guid } from "@/libs/stp@types";
import React from "react";

interface StatisticsDrawerProps {
	characterId: Guid;
	characterActionPool: CharacterActionPool;
}
function _StatisticsDrawer({
	characterId,
	characterActionPool,
}: StatisticsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Estatísticas"
			memoryId={`${characterId}-Statistics`}>
			<NotionBox
				backgroundColor="blue"
				withoutMargin
				withoutBorder>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterEditableDataDisplays.ActionPool
							characterActionPool={characterActionPool}
						/>
					}
					colum2={<CharacterEditableDataDisplays.CoreMiscAndSimpleMetrics />}
				/>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterEditableDataDisplays.Gauge
							gauge="healthPoints"
							name="Vida"
							acronym="HP"
							color="red"
						/>
					}
					colum2={
						<CharacterEditableDataDisplays.Gauge
							gauge="manaPoints"
							name="Mana"
							acronym="MP"
							color="blue"
						/>
					}
				/>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterEditableDataDisplays.Gauge
							gauge="staminaPoints"
							name="Estamina"
							acronym="EP"
							color="green"
						/>
					}
					colum2={
						<CharacterEditableDataDisplays.Traits characterId={characterId} />
					}
				/>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}

function areEqual(
	prevProps: StatisticsDrawerProps,
	nextProps: StatisticsDrawerProps
) {
	return (
		prevProps.characterId === nextProps.characterId &&
		prevProps.characterActionPool === nextProps.characterActionPool
	);
}
export const StatisticsDrawer = React.memo(_StatisticsDrawer, areEqual);
