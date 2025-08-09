import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
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
			<NotionBox
				backgroundColor="blue"
				withoutMargin
				withoutBorder>
				<Notion2Columns
					withoutPadding
					withoutBorderRadius
					withoutGap
					colum1={
						<CharacterDataDisplays.ActionPool
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
				<Notion2Columns
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
				<Notion2Columns
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
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
