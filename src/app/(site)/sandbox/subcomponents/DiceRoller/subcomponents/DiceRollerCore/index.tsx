"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";
import { useEffect, useState } from "react";
import { SimpleLeftHand } from "../SimpleLeftHand";
import { DiceResults } from "@/libs/stp@types";
import { DiceResultHistoryView } from "../DiceResultHistoryView";
import { DiceResultsWithTimestamp } from "@/libs/stp@types/otherTypes/DiceRoller";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import toast from "react-hot-toast";
import { DiceResultView } from "../DiceResultView";

const DiceRollerCoreContainer = newStyledElement.div(
	styles.diceRollerCoreContainer,
);
const RightHand = newStyledElement.div(styles.rightHand);

const DiceToastMessage = {
	loading: "Rolando...",
	success: "Rolagem bem sucedida",
	error: "Falha na rolagem",
	invalid: "Rolagem inválida",
};

export async function postDiceRoll(
	diceExpression: string,
	showToast: boolean = false,
): Promise<DiceResults | null> {
	const response = await authenticatedFetchAsync(
		getAlbinaApiFullAddress("/peer-out/ChariotSanzzo/peer-in/dice-roller"),
		{
			method: "POST",
			body: JSON.stringify({
				diceExpression: diceExpression,
			}),
		},
	);
	if (!response.ok) {
		if (response.status == 400) toast.error(DiceToastMessage.invalid);
		else toast.error(DiceToastMessage.error);
		return null;
	}
	const data: { diceResults: DiceResults } = await response.json();
	if (showToast && data.diceResults)
		toast.success(
			<DiceResultView
				diceResult={data.diceResults}
				width={300}
			/>,
			{
				position: "bottom-center",
				className: styles.diceViewToast,
				icon: <></>,
			},
		);
	return data.diceResults;
}

interface DiceRollerCoreProps {
	mode: "simple" | "advanced";
	standaloneMode?: boolean;
	primaryColor: `#${string}`;
	secondaryColor: `#${string}`;
}
export function DiceRollerCore({
	mode,
	standaloneMode = false,
}: DiceRollerCoreProps) {
	const [diceHistory, setDiceHistory] = useState<DiceResultsWithTimestamp[]>(
		[],
	);
	// const [diceExpression, setDiceExpression] = useState<string>("");

	function addDiceResultToHistory(diceResult: DiceResults) {
		const newDiceHistory: DiceResultsWithTimestamp[] = [
			{ ...diceResult, timestamp: Date.now() },
			...diceHistory.slice(0, 14),
		];
		setDiceHistory(newDiceHistory);
		localStorage.setItem("DiceRollerHistory", JSON.stringify(newDiceHistory));
	}
	function resetDiceHistory() {
		setDiceHistory([]);
		localStorage.setItem("DiceRollerHistory", "[]");
	}

	useEffect(() => {
		const diceHistory: DiceResultsWithTimestamp[] = JSON.parse(
			localStorage.getItem("DiceRollerHistory") ?? "[]",
		);
		setDiceHistory(diceHistory);
	}, []);

	return (
		<DiceRollerCoreContainer>
			{mode == "simple" ? (
				<SimpleLeftHand
					addDiceResultToHistory={addDiceResultToHistory}
					primaryColor={StandartTextColor.orange}
					secondaryColor={StandartTextColor.darkGray}
					size={100}
					standaloneMode={standaloneMode}
				/>
			) : (
				<></>
			)}
			<RightHand>
				<DiceResultHistoryView
					diceHistory={diceHistory}
					resetHistory={resetDiceHistory}
				/>
			</RightHand>
		</DiceRollerCoreContainer>
	);
}
