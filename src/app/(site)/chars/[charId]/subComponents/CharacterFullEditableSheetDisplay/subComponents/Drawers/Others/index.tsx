import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
import {
	CharacterProfile,
	CharacterSpellDomains,
	Guid,
} from "@/libs/stp@types";

interface OthersDrawerProps {
	characterId: Guid;
	characterBackstory: string;
	characterProfile: CharacterProfile;
}
export function OthersDrawer({
	characterId,
	characterBackstory,
	characterProfile,
}: OthersDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Outros"
			memoryId={`${characterId}-Others`}>
			<NotionBox
				backgroundColor="blue"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterEditableDataDisplays.Profile
					characterProfile={characterProfile}
				/>
				<CharacterEditableDataDisplays.Backstory
					characterBackstory={characterBackstory}
				/>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
