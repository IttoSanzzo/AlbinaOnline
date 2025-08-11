import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
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
			<UIBasics.Box
				backgroundColor="blue"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterDataDisplays.Profile characterProfile={characterProfile} />
				<CharacterDataDisplays.Backstory
					characterBackstory={characterBackstory}
				/>
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
