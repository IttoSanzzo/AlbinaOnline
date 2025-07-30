export function abilityScoreBonusValue(abilityScore: number) {
	return abilityScore <= 10
		? abilityScore - 10
		: Math.floor((abilityScore - 10) / 3);
}
