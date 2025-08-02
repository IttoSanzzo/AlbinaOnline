import { SkillsDrawer } from "./Skills";
import { SpellsDrawer } from "./Spells";
import { SpellDomainsDrawer } from "./SpellDomains";
import { ParametersAndAtributeScoresDrawer } from "./ParametersAndAtributeScores";
import { MasteriesAndTestsDrawer } from "./MasteriesAndTests";
import { OthersDrawer } from "./Others";

export const CharacterDrawers = {
	Skills: SkillsDrawer,
	Spells: SpellsDrawer,
	SpellDomains: SpellDomainsDrawer,
	ParametersAndAtributeScores: ParametersAndAtributeScoresDrawer,
	MasteriesAndTests: MasteriesAndTestsDrawer,
	Others: OthersDrawer,
};
