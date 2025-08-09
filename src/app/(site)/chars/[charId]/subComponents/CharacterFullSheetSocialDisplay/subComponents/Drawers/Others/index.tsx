import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { CharacterProfile, Guid } from "@/libs/stp@types";

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
				<CharacterDataDisplays.Profile characterProfile={characterProfile} />
				<CharacterDataDisplays.Backstory
					characterBackstory={characterBackstory}
				/>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
