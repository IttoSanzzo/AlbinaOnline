import { SpellDomainsDrawer } from "./SpellDomains";
import { ParametersAndAtributeScoresDrawer } from "./ParametersAndAtributeScores";
import { MasteriesAndTestsDrawer } from "./MasteriesAndTests";
import { OthersDrawer } from "./Others";
import { InventoryDrawer } from "./Inventory";
import { StatisticsDrawer } from "./Statistics";
import { TraitsSkillsSpellsDrawer } from "./TraitsSkillsSpells";

export const CharacterDrawers = {
	Inventory: InventoryDrawer,
	Statistics: StatisticsDrawer,
	TraitsSkillsSpells: TraitsSkillsSpellsDrawer,
	SpellDomains: SpellDomainsDrawer,
	ParametersAndAtributeScores: ParametersAndAtributeScoresDrawer,
	MasteriesAndTests: MasteriesAndTestsDrawer,
	Others: OthersDrawer,
};
