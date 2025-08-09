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
import { CharacterActionsPoolDisplay } from "./ActionsPool";
import { CharacterGaugeDisplay } from "./CharacterGaugeDisplay";
import { CoreMiscAndSimpleMetrics } from "./CoreMiscAndSimpleMetrics";

export const CharacterDataDisplays = {
	ItemStacks: CharacterItemStacksDisplay,
	CoinStacks: CharacterCoinStacksDisplay,
	Equipments: CharacterEquipmentsDisplay,
	Gauge: CharacterGaugeDisplay,
	CoreMiscAndSimpleMetrics: CoreMiscAndSimpleMetrics,
	ActionsPool: CharacterActionsPoolDisplay,
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
