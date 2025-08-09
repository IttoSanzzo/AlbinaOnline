import {
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import { CharacterActionsPool, Guid } from "@/libs/stp@types";

function formTableEntry(title: string, value: number) {
	return [
		<NotionText
			textColor="gray"
			children={title}
		/>,
		<NotionText
			display="block"
			textAlign="center"
			textColor="gray"
			children={value.toString()}
		/>,
	];
}

interface CharacterActionsPoolDisplayProps {
	characterId: Guid;
	actionsPool: CharacterActionsPool;
}
export function CharacterActionsPoolDisplay({
	characterId,
	actionsPool,
}: CharacterActionsPoolDisplayProps) {
	return (
		<NotionToggleHeader
			contentMargin="none"
			backgroundColor="darkGray"
			titleColor="yellow"
			title="Ações / Turno"
			memoryId={`${characterId}-ActionPool`}>
			<div style={{ display: "flex" }}>
				<NotionTable
					tableData={{
						tableLanes: [
							formTableEntry("Normais", actionsPool.normalActions),
							formTableEntry("Bônus", actionsPool.bonusActions),
							formTableEntry("Reações", actionsPool.reactions),
							formTableEntry("Ardilosas", actionsPool.cunningActions),
							formTableEntry("Mágicas", actionsPool.magicActions),
							formTableEntry("Especiais", actionsPool.specialActions),
						],
					}}
				/>
			</div>
		</NotionToggleHeader>
	);
}
