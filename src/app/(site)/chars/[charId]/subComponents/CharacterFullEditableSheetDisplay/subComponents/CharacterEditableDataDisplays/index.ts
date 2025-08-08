import { CharacterAbilityScoreDisplay } from "./AbilityScore";
import { CharacterParametersDisplay } from "./Parameters";
import { CharacterSpellDomainsDisplay } from "./SpellDomains";
import { CharacterMasteriesFromTypeDisplay } from "./MasteriesFromType";
import { CharacterBackstoryDisplay } from "./Backstory";
import { CharacterProfileDisplay } from "./Profile";
import { CharacterSkillsDisplay } from "./Skills";
import { CharacterSpellsDisplay } from "./Spells";
import { CharacterTraitsDisplay } from "./Traits";
import { CharacterCoinStacksDisplay } from "./CoinStacks";
import { CharacterItemStacksDisplay } from "./ItemStacks";
import { CharacterEquipmentsDisplay } from "./Equipments";
import { CharacterActionPoolDisplay } from "./ActionPool";
import { CharacterGaugeEditableDisplay } from "./CharacterGaugeEditableDisplay";
import { CoreMiscAndSimpleMetrics } from "./CoreMiscAndSimpleMetrics";

export const CharacterEditableDataDisplays = {
	ItemStacks: CharacterItemStacksDisplay,
	CoinStacks: CharacterCoinStacksDisplay,
	Equipments: CharacterEquipmentsDisplay,
	Gauge: CharacterGaugeEditableDisplay,
	CoreMiscAndSimpleMetrics: CoreMiscAndSimpleMetrics,
	ActionPool: CharacterActionPoolDisplay,
	Skills: CharacterSkillsDisplay,
	Spells: CharacterSpellsDisplay,
	Traits: CharacterTraitsDisplay,
	SpellDomains: CharacterSpellDomainsDisplay,
	AbilityScore: CharacterAbilityScoreDisplay,
	Parameters: CharacterParametersDisplay,
	MasteriesFromType: CharacterMasteriesFromTypeDisplay,
	Backstory: CharacterBackstoryDisplay,
	Profile: CharacterProfileDisplay,
};
