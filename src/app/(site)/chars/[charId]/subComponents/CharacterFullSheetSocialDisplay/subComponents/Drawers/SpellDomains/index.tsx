import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterDataDisplays } from "../../CharacterDataDisplays";
import { CharacterSpellDomains, Guid } from "@/libs/stp@types";

interface SpellDomainsDrawerProps {
	characterId: Guid;
	spellDomains: CharacterSpellDomains;
}
export function SpellDomainsDrawer({
	characterId,
	spellDomains,
}: SpellDomainsDrawerProps) {
	return (
		<CharacterDrawerBaseHeader
			title="Domínios"
			memoryId={`${characterId}-SpellDomains`}>
			<NotionBox
				backgroundColor="purple"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterDataDisplays.SpellDomains spellDomains={spellDomains} />
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
