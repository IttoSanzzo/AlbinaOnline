import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import { CharacterSkill } from "@/libs/stp@types";

interface SkillsDrawerProps {
	characterId: string;
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
				<CharacterEditableDataDisplays.Skills characterId={characterId} />
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
