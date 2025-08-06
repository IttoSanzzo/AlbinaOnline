import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
import { NotionBox } from "@/components/(NotionBased)";
import { CharacterEditableDataDisplays } from "../../CharacterEditableDataDisplays";
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
				<CharacterEditableDataDisplays.SpellDomains
					spellDomains={spellDomains}
				/>
			</NotionBox>
		</CharacterDrawerBaseHeader>
	);
}
