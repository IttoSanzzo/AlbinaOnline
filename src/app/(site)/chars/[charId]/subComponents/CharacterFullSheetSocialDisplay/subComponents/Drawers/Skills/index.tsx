import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
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
				<CharacterDataDisplays.Skills characterId={characterId} />
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
