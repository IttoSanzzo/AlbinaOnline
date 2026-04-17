import { SpellDomainsDrawer } from "./SpellDomains";
import { OthersDrawer } from "./Others";
import { ParametersAndMasteriesDrawer } from "./ParametersAndMasteries";
import { InventoryDrawer } from "./Inventory";
import { StatisticsDrawer } from "./Statistics";
import { TraitsSkillsSpellsDrawer } from "./TraitsSkillsSpells";

export const CharacterDrawers = {
	Inventory: InventoryDrawer,
	Statistics: StatisticsDrawer,
	TraitsSkillsSpells: TraitsSkillsSpellsDrawer,
	SpellDomains: SpellDomainsDrawer,
	ParametersAndMasteries: ParametersAndMasteriesDrawer,
	Others: OthersDrawer,
};
