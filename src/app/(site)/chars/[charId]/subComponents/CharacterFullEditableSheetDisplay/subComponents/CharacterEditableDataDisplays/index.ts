import { CharacterAbilityScoreDisplay } from "./AbilityScore";
import { CharacterParametersDisplay } from "./Parameters";
import { CharacterSpellDomainsDisplay } from "./SpellDomains";
import { CharacterMasteriesFromTypeDisplay } from "./MasteriesFromType";
import { CharacterBackstoryDisplay } from "./Backstory";
import { CharacterProfileDisplay } from "./Profile";
import { CharacterSkillsDisplay } from "./Skills";
import { CharacterSpellsDisplay } from "./Spells";
import { CharacterCoinStacksDisplay } from "./CoinStacks";

export const CharacterEditableDataDisplays = {
	CoinStacks: CharacterCoinStacksDisplay,
	Skills: CharacterSkillsDisplay,
	Spells: CharacterSpellsDisplay,
	SpellDomains: CharacterSpellDomainsDisplay,
	AbilityScore: CharacterAbilityScoreDisplay,
	Parameters: CharacterParametersDisplay,
	MasteriesFromType: CharacterMasteriesFromTypeDisplay,
	Backstory: CharacterBackstoryDisplay,
	Profile: CharacterProfileDisplay,
};
