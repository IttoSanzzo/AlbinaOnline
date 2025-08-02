import { CharacterAbilityScoreDisplay } from "./AbilityScore";
import { CharacterParametersDisplay } from "./Parameters";
import { CharacterSpellDomainsDisplay } from "./SpellDomains";
import { CharacterMasteriesFromTypeDisplay } from "./MasteriesFromType";
import { CharacterBackstoryDisplay } from "./Backstory";
import { CharacterProfileDisplay } from "./Profile";
import { CharacterSkillsDisplay } from "./Skills";
import { CharacterSpellsDisplay } from "./Spells";

export const CharacterEditableDataDisplays = {
	Skills: CharacterSkillsDisplay,
	Spells: CharacterSpellsDisplay,
	SpellDomains: CharacterSpellDomainsDisplay,
	AbilityScore: CharacterAbilityScoreDisplay,
	Parameters: CharacterParametersDisplay,
	MasteriesFromType: CharacterMasteriesFromTypeDisplay,
	Backstory: CharacterBackstoryDisplay,
	Profile: CharacterProfileDisplay,
};
