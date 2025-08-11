import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { Guid } from "@/libs/stp@types";

interface SkillsDrawerProps {
	characterId: Guid;
}
export function SkillsDrawer({ characterId }: SkillsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Skills"
			memoryId={`${characterId}-Skills`}>
			<UIBasics.Box
				backgroundColor="blue"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterEditableDataDisplays.Skills characterId={characterId} />
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
