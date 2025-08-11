import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import {
	CharacterActionsPool,
	CharacterCoreMetrics,
	CharacterMiscMetrics,
	Guid,
} from "@/libs/stp@types";
import React from "react";

interface StatisticsDrawerProps {
	characterId: Guid;
	actionsPool: CharacterActionsPool;
	coreMetrics: CharacterCoreMetrics;
	miscMetrics: CharacterMiscMetrics;
}
export function StatisticsDrawer({
	characterId,
	actionsPool,
	coreMetrics,
	miscMetrics,
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
						<CharacterDataDisplays.ActionsPool
							characterId={characterId}
							actionsPool={actionsPool}
						/>
					}
					colum2={
						<CharacterDataDisplays.CoreMiscAndSimpleMetrics
							characterId={characterId}
							coreMetrics={coreMetrics}
							miscMetrics={miscMetrics}
						/>
					}
				/>
				<UIBasics.MultiColumn.Two
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterDataDisplays.Gauge
							characterId={characterId}
							coreMetrics={coreMetrics}
							gauge="healthPoints"
							name="Vida"
							acronym="HP"
							color="red"
						/>
					}
					colum2={
						<CharacterDataDisplays.Gauge
							characterId={characterId}
							coreMetrics={coreMetrics}
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
						<CharacterDataDisplays.Gauge
							characterId={characterId}
							coreMetrics={coreMetrics}
							gauge="staminaPoints"
							name="Estamina"
							acronym="EP"
							color="green"
						/>
					}
					colum2={<CharacterDataDisplays.Traits characterId={characterId} />}
				/>
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
