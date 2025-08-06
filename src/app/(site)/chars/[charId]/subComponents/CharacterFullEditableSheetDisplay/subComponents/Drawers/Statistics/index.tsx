import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { Notion2Columns, NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterCoinStack, CharacterItemStack, Guid } from "@/libs/stp@types";
import React from "react";

interface StatisticsDrawerProps {
	characterId: Guid;
}
function _StatisticsDrawer({ characterId }: StatisticsDrawerProps) {
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
						<CharacterEditableDataDisplays.Traits characterId={characterId} />
					}
					colum2={<></>}
				/>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}

function areEqual(
	prevProps: StatisticsDrawerProps,
	nextProps: StatisticsDrawerProps
) {
	return prevProps.characterId === nextProps.characterId;
}
export const StatisticsDrawer = React.memo(_StatisticsDrawer, areEqual);
