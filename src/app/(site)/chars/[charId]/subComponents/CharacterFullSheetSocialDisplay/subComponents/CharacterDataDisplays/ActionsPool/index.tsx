import { UIBasics } from "@/components/(UIBasics)";
import { CharacterActionsPool, Guid } from "@/libs/stp@types";

function formTableEntry(title: string, value: number) {
	return [
		<UIBasics.Text
			textColor="gray"
			children={title}
		/>,
		<UIBasics.Text
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
	actionsPool,
}: CharacterActionsPoolDisplayProps) {
	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin
			withoutBorder
			withoutBorderRadius
			style={{ borderTopLeftRadius: "var(--rd-md)", padding: "5px" }}>
			<UIBasics.Header
				children="Ações / Turno"
				textAlign="center"
				headerType="h2"
				textColor="yellow"
			/>
			<div style={{ display: "flex" }}>
				<UIBasics.Table
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
		</UIBasics.Box>
	);
}
