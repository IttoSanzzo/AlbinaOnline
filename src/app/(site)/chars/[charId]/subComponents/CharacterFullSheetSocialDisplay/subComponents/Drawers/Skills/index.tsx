import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { CharacterSkill, Guid } from "@/libs/stp@types";

interface SkillsDrawerProps {
	characterId: Guid;
}
export function SkillsDrawer({ characterId }: SkillsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Skills"
			memoryId={`${characterId}-Skills`}>
			<NotionBox
				backgroundColor="blue"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterDataDisplays.Skills characterId={characterId} />
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
