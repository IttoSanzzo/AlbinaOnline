import { UIBasics } from "@/components/(UIBasics)";
import { CharacterDrawerBaseHeader } from "../../../../CharacterDrawerBaseHeader";
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
			<UIBasics.Box
				backgroundColor="purple"
				withoutPadding
				withoutMargin
				withoutBorder>
				<CharacterEditableDataDisplays.SpellDomains
					spellDomains={spellDomains}
				/>
			</UIBasics.Box>
		</CharacterDrawerBaseHeader>
	);
}
