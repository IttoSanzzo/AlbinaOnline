import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterActionsPool, Guid } from "@/libs/stp@types";
import React from "react";

interface StatisticsDrawerProps {
	characterId: Guid;
	characterActionsPool: CharacterActionsPool;
}
function _StatisticsDrawer({
	characterId,
	characterActionsPool,
}: StatisticsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Estatísticas"
			memoryId={`${characterId}-Statistics`}>
			<UIBasics.Box
				backgroundColor="blue"
				withoutMargin
				withoutBorder>
				<UIBasics.MultiColumn.Two
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterEditableDataDisplays.ActionsPool
							characterActionsPool={characterActionsPool}
						/>
					}
					colum2={<CharacterEditableDataDisplays.CoreMiscAndSimpleMetrics />}
				/>
				<UIBasics.MultiColumn.Two
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
				<UIBasics.MultiColumn.Two
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
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}

function areEqual(
	prevProps: StatisticsDrawerProps,
	nextProps: StatisticsDrawerProps
) {
	return (
		prevProps.characterId === nextProps.characterId &&
		prevProps.characterActionsPool === nextProps.characterActionsPool
	);
}
export const StatisticsDrawer = React.memo(_StatisticsDrawer, areEqual);
