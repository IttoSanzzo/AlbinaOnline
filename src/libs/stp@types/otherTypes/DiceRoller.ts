export interface DiceIterationResult {
	nodeResults: number[][];
	totalResult: number;
}
export interface DiceNode {
	nodeOperator: string;
	nodeExpression: string;
	advantageValue: number;
	countValue: number;
	sideValue: number;
	type: "DiceSet" | "Constant";
}
export interface DiceResults {
	wasSuccess: boolean;
	errorMessage: string;
	formattedExpression: string;
	maxResultWidth: number;
	diceNodes: DiceNode[];
	iterationResults: DiceIterationResult[];
}

export interface DiceResultsWithTimestamp extends DiceResults {
	timestamp: number;
}
