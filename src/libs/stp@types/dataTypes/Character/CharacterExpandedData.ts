import {
	CharacterAbilityScore,
	CharacterAccessPermission,
	CharacterActionPool,
	CharacterBackstory,
	CharacterCoinStack,
	CharacterCoreMetrics,
	CharacterItemStack,
	CharacterMastery,
	CharacterMiscMetrics,
	CharacterParameters,
	CharacterProfile,
	CharacterSkill,
	CharacterSpell,
	CharacterSpellDomains,
	CharacterTrait,
	FullUser,
	RaceData,
} from "../../";
import { CharacterData } from "./CharacterData";

export type CharacterExpandedData = {
	owner: FullUser;
	race: RaceData;
	abilityScore: CharacterAbilityScore;
	actionPool: CharacterActionPool;
	coreMetrics: CharacterCoreMetrics;
	miscMetrics: CharacterMiscMetrics;
	profile: CharacterProfile;
	backstory: CharacterBackstory;
	parameters: CharacterParameters;
	spellDomains: CharacterSpellDomains;
	coinStacks: CharacterCoinStack[];
	itemStacks: CharacterItemStack[];
	acquiredMasteries: CharacterMastery[];
	acquiredSkills: CharacterSkill[];
	acquiredSpells: CharacterSpell[];
	acquiredTraits: CharacterTrait[];
	accessPermissions: CharacterAccessPermission[];
} & CharacterData;
