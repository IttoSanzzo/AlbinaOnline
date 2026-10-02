import { DiceResults, Guid } from "@/libs/stp@types";

export interface VttDiceResult {
	id: Guid;
	userId: Guid;
	results: DiceResults;
	private: boolean;
	timestamp: number;
}
