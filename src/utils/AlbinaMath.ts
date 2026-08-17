export function abilityScoreBonusValue(abilityScore: number) {
	return abilityScore <= 10
		? abilityScore - 10
		: Math.floor((abilityScore - 10) / 3);
}
export function creatureAbilityScoreBonusValue(abilityScore: number) {
	return Math.floor((abilityScore - 10) / 2);
}
