import { DiceIterationResult, DiceResults } from "@/libs/stp@types";
import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./VttDiceResultView.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { VttDiceResult } from "../../../Types/Classes/VttDiceResult";
import Image, { StaticImageData } from "next/image";

const VttDiceResultViewContainer = newStyledElement.div(
	styles.vttDiceResultViewContainer,
);
const DiceExpression = newStyledElement.div(styles.diceExpression);
const CenteredNumberResult = newStyledElement.div(styles.centeredNumberResult);
const DiceAuthor = newStyledElement.div(styles.diceAuthor);
const DiceAuthorImage = newStyledElement.div(styles.diceAuthorImage);
const CenteredNumberNodesResults = newStyledElement.div(
	styles.centeredNumberNodesResults,
);
const DiceDatetime = newStyledElement.div(styles.diceDatetime);
const DiceResultBackline = newStyledElement.div(styles.resultsBackline);

function getResultColor(
	results: DiceResults,
	iterationIndex: number,
): undefined | CSSProperties["color"] {
	let diceNodeIndex: number = 0;
	let diceNodeCount: number = 0;
	results.diceNodes.forEach((node, index) => {
		if (node.type == "DiceSet") {
			diceNodeIndex = index;
			++diceNodeCount;
		}
	});
	if (diceNodeCount != 1) return undefined;
	const remainingDice =
		results.diceNodes[diceNodeIndex].countValue -
		Math.abs(results.diceNodes[diceNodeIndex].advantageValue);
	if (remainingDice != 1) return undefined;
	const result =
		results.diceNodes[diceNodeIndex].advantageValue >= 0
			? results.iterationResults[iterationIndex].nodeResults[diceNodeIndex][0]
			: results.iterationResults[iterationIndex].nodeResults[diceNodeIndex][
					results.iterationResults[iterationIndex].nodeResults[diceNodeIndex]
						.length - 1
				];
	return result == results.diceNodes[diceNodeIndex].sideValue
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
	results: DiceResults;
	iterationResult: DiceIterationResult;
}
function RollResultBackline({
	results,
	iterationResult,
}: RollResultBacklineProps) {
	return (
		<DiceResultBackline>
			{iterationResult.nodeResults.map((nodeResult, index) => (
				<span key={index}>
					{index != 0 && <>{"\u00A0"}</>}
					{results.diceNodes[index].type == "DiceSet" ? (
						<>
							{index != 0 && `${results.diceNodes[index].nodeOperator} `}
							{DiceResultArrayWithAdvantage(
								nodeResult,
								results.diceNodes[index].advantageValue,
							)}
							{"\u00A0"}
							{results.diceNodes[index].nodeExpression.includes(" ")
								? results.diceNodes[index].nodeExpression.slice(
										results.diceNodes[index].nodeExpression.indexOf(" ") + 1,
									)
								: results.diceNodes[index].nodeExpression}
						</>
					) : index != 0 ? (
						results.diceNodes[index].nodeExpression
					) : (
						nodeResult[0]
					)}
				</span>
			))}
		</DiceResultBackline>
	);
}
function DiceResultArrayWithAdvantageString(
	results: number[],
	advantage: number,
): string {
	if (advantage == 0) return `[${results.join(", ")}]`;
	if (advantage > 0) {
		const kept = results.slice(0, results.length - advantage);
		const discarded = results.slice(results.length - advantage);
		return `[${kept.join(", ")}${kept.length > 0 && discarded.length > 0 ? ", " : ""}${discarded.join(", ")}]`;
	}
	advantage = Math.abs(advantage);
	const discarded = results.slice(0, advantage);
	const kept = results.slice(advantage);
	return `[${discarded.join(", ")}${discarded.length > 0 && kept.length > 0 ? ", " : ""}${kept.join(", ")}]`;
}
function GetRollResultsText(results: DiceResults): string {
	return results.iterationResults
		.map((iterationResult) => {
			const backline = iterationResult.nodeResults
				.map((nodeResult, index) => {
					const node = results.diceNodes[index];
					if (node.type == "DiceSet") {
						const expression = node.nodeExpression.includes(" ")
							? node.nodeExpression.slice(node.nodeExpression.indexOf(" ") + 1)
							: node.nodeExpression;
						return [
							index != 0 ? node.nodeOperator : "",
							DiceResultArrayWithAdvantageString(
								nodeResult,
								node.advantageValue,
							),
							expression,
						]
							.filter(Boolean)
							.join(" ");
					}
					return index != 0 ? node.nodeExpression : `${nodeResult[0]}`;
				})
				.join(" ");
			return `${iterationResult.totalResult}\t${backline}`;
		})
		.join("\n");
}

interface VttDiceResultViewProps {
	vttDiceResult: VttDiceResult;
	memberName: string;
	memberImage: string | StaticImageData;
	isFloat?: boolean;
}
export function VttDiceResultView({
	vttDiceResult,
	memberName,
	memberImage,
	isFloat = true,
}: VttDiceResultViewProps) {
	const results = vttDiceResult.results;
	const multiIteration = results.iterationResults.length > 1;

	const privateStyle = vttDiceResult.private
		? {
				border: "2px solid var(--cl-violet-1100)",
			}
		: undefined;
	const id = isFloat ? undefined : `vtt-dice-box-history|${vttDiceResult.id}`;

	const DExpression = (
		<DiceExpression
			id={vttDiceResult.id}
			title={results.formattedExpression}
			className={multiIteration ? styles.multiIteration : undefined}
			style={{ ...privateStyle, borderBottom: "none", borderLeft: "none" }}
			children={
				multiIteration
					? results.formattedExpression.length > 40
						? `${results.formattedExpression.slice(0, 40)}...`
						: results.formattedExpression
					: results.formattedExpression.length > 13
						? `${results.formattedExpression.slice(0, 13)}...`
						: results.formattedExpression
			}
		/>
	);
	const DDatetime = (
		<DiceDatetime
			id={vttDiceResult.id}
			title={new Date(vttDiceResult.timestamp).toLocaleString("pt-BR", {
				dateStyle: "long",
				timeStyle: "medium",
			})}
			style={{
				...privateStyle,
				borderTop: "none",
				borderRight: "none",
			}}>
			{new Date(vttDiceResult.timestamp).toLocaleString("pt-BR", {
				timeStyle: "medium",
			})}
		</DiceDatetime>
	);
	const DAuthor = (
		<DiceAuthor
			id={vttDiceResult.id}
			title={memberName}
			style={{ ...privateStyle, borderTop: "none", borderLeft: "none" }}>
			<DiceAuthorImage>
				<Image
					src={memberImage}
					alt={""}
					height={10}
					width={10}
				/>
			</DiceAuthorImage>
			{memberName.length > 20 ? `${memberName.slice(0, 17)}...` : memberName}
		</DiceAuthor>
	);

	if (!multiIteration) {
		const diceColor = getResultColor(results, 0);

		return (
			<VttDiceResultViewContainer
				id={id}
				style={
					vttDiceResult.private
						? {
								borderColor: "var(--cl-violet-1100)",
							}
						: undefined
				}>
				{DDatetime}
				{DExpression}
				<CenteredNumberResult style={{ color: diceColor }}>
					{results.iterationResults[0].totalResult}
				</CenteredNumberResult>
				<CenteredNumberNodesResults
					style={{ ...privateStyle, borderBottom: "none", borderRight: "none" }}
					title={GetRollResultsText(results)}
					children={
						<RollResultBackline
							results={results}
							iterationResult={results.iterationResults[0]}
						/>
					}
				/>
				{DAuthor}
			</VttDiceResultViewContainer>
		);
	}
	return (
		<VttDiceResultViewContainer id={id}>
			{DDatetime}
			{DExpression}
			{DAuthor}
			<UIBasics.Table
				className={styles.resultsTable}
				fixedLineWidths={[4 + results.maxResultWidth * 3]}
				fixedLinePositions={[1]}
				withoutMargin
				tableData={{
					tableLanes: [
						...results.iterationResults.map((iterationResult, index) => [
							<span style={{ color: getResultColor(results, index) }}>
								{iterationResult.totalResult}
							</span>,
							<RollResultBackline
								results={results}
								iterationResult={iterationResult}
							/>,
						]),
					],
				}}
			/>
		</VttDiceResultViewContainer>
	);
}
