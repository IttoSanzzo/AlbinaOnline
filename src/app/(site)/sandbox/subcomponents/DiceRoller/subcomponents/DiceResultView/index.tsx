import { DiceIterationResult, DiceResults } from "@/libs/stp@types";
import { CSSProperties, forwardRef } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";

const DiceExpression = newStyledElement.div(styles.diceExpression);
const UniqueCenteredNumberResult = newStyledElement.div(
	styles.uniqueCenteredNumberResult,
);
const UniqueCenteredNumberNodesResults = newStyledElement.div(
	styles.uniqueCenteredNumberNodesResults,
);
const DiceResultBackline = newStyledElement.div(styles.diceResultBackline);

function getResultColor(
	diceResult: DiceResults,
	iterationIndex: number,
): undefined | CSSProperties["color"] {
	let diceNodeIndex: number = 0;
	let diceNodeCount: number = 0;
	diceResult.diceNodes.forEach((node, index) => {
		if (node.type == "DiceSet") {
			diceNodeIndex = index;
			++diceNodeCount;
		}
	});
	if (diceNodeCount != 1) return undefined;
	const remainingDice =
		diceResult.diceNodes[diceNodeIndex].countValue -
		Math.abs(diceResult.diceNodes[diceNodeIndex].advantageValue);
	if (remainingDice != 1) return undefined;
	const result =
		diceResult.diceNodes[diceNodeIndex].advantageValue >= 0
			? diceResult.iterationResults[iterationIndex].nodeResults[
					diceNodeIndex
				][0]
			: diceResult.iterationResults[iterationIndex].nodeResults[diceNodeIndex][
					diceResult.iterationResults[iterationIndex].nodeResults[diceNodeIndex]
						.length - 1
				];
	return result == diceResult.diceNodes[diceNodeIndex].sideValue
		? "orange"
		: result == 1
			? "red"
			: undefined;
}
function DiceResultArrayWithAdvantage(results: number[], advantage: number) {
	if (advantage == 0) return <span>{`[${results.join(", ")}]`}</span>;
	else if (advantage > 0)
		return (
			<span>
				{"["}
				<span>{results.slice(0, results.length - advantage).join(", ")}</span>
				{results.length > advantage && <>{",\u00A0"}</>}
				<span
					style={{
						textDecoration: "line-through",
						color: "var(--cl-gray-500)",
					}}>
					{results.slice(results.length - advantage).join(", ")}
				</span>
				{"]"}
			</span>
		);
	advantage = Math.abs(advantage);
	return (
		<span>
			{"["}
			<span
				style={{ textDecoration: "line-through", color: "var(--cl-gray-500)" }}>
				{results.slice(0, advantage).join(", ")}
			</span>
			{results.length > advantage && <>{",\u00A0"}</>}
			<span>{results.slice(advantage).join(", ")}</span>
			{"]"}
		</span>
	);
}

interface RollResultBacklineProps {
	diceResult: DiceResults;
	iterationResult: DiceIterationResult;
}
function RollResultBackline({
	diceResult,
	iterationResult,
}: RollResultBacklineProps) {
	return (
		<DiceResultBackline>
			{iterationResult.nodeResults.map((nodeResult, index) => (
				<span key={index}>
					{index != 0 && <>{"\u00A0"}</>}
					{diceResult.diceNodes[index].type == "DiceSet" ? (
						<>
							{index != 0 && `${diceResult.diceNodes[index].nodeOperator} `}
							{DiceResultArrayWithAdvantage(
								nodeResult,
								diceResult.diceNodes[index].advantageValue,
							)}
							{"\u00A0"}
							{diceResult.diceNodes[index].nodeExpression.includes(" ")
								? diceResult.diceNodes[index].nodeExpression.slice(
										diceResult.diceNodes[index].nodeExpression.indexOf(" ") + 1,
									)
								: diceResult.diceNodes[index].nodeExpression}
						</>
					) : index != 0 ? (
						diceResult.diceNodes[index].nodeExpression
					) : (
						nodeResult[0]
					)}
				</span>
			))}
		</DiceResultBackline>
	);
}

interface DiceResultViewProps {
	diceResult: DiceResults;
	width?: number;
}
export const DiceResultView = forwardRef<HTMLDivElement, DiceResultViewProps>(
	function DiceResultView({ diceResult, width }: DiceResultViewProps, ref) {
		if (diceResult.iterationResults.length == 1) {
			const diceColor = getResultColor(diceResult, 0);

			return (
				<UIBasics.Box
					ref={ref}
					classname={styles.diceResultViewContainer}
					width={width}>
					<DiceExpression children={diceResult.formattedExpression} />
					<UniqueCenteredNumberResult style={{ color: diceColor }}>
						{diceResult.iterationResults[0].totalResult}
					</UniqueCenteredNumberResult>
					<UniqueCenteredNumberNodesResults
						children={
							<RollResultBackline
								diceResult={diceResult}
								iterationResult={diceResult.iterationResults[0]}
							/>
						}
					/>
				</UIBasics.Box>
			);
		}
		return (
			<UIBasics.Box
				ref={ref}
				classname={styles.diceResultViewContainer}>
				<DiceExpression children={diceResult.formattedExpression} />
				<UIBasics.Table
					fixedLineWidths={[4 + diceResult.maxResultWidth * 3]}
					fixedLinePositions={[1]}
					withoutMargin
					tableData={{
						tableLanes: [
							...diceResult.iterationResults.map((iterationResult, index) => [
								<span style={{ color: getResultColor(diceResult, index) }}>
									{iterationResult.totalResult}
								</span>,
								<RollResultBackline
									diceResult={diceResult}
									iterationResult={iterationResult}
								/>,
							]),
						],
					}}
				/>
			</UIBasics.Box>
		);
	},
);
