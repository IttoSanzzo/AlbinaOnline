import { UIBasics } from "@/components/(UIBasics)";
import { DiceResultsWithTimestamp } from "@/libs/stp@types";
import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { DiceResultView } from "../DiceResultView";
import { newStyledElement } from "@setsu-tp/styled-components";
import ResetIcon from "@/../public/general-assets/CircularResetIcon.png";
import Image from "next/image";

const ResetButton = newStyledElement.button(styles.resetButton);

interface DiceResultHistoryViewProps {
	diceHistory: DiceResultsWithTimestamp[];
	resetHistory?: () => void;
}
export function DiceResultHistoryView({
	diceHistory,
	resetHistory,
}: DiceResultHistoryViewProps) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (ref.current == null) return;
		ref.current.scrollIntoView({
			behavior: "smooth",
		});
	}, [ref.current]);
	useEffect(() => {
		setTimeout(() => {
			if (ref.current == null) return;
			ref.current.scrollIntoView({
				behavior: "smooth",
			});
		}, 500);
	}, []);

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutBorder
			classname={styles.diceResultHistoryViewContainer}>
			{diceHistory.length > 0 ? (
				<>
					<div>
						{diceHistory.toReversed().map((result, index) => (
							<DiceResultView
								key={result.timestamp}
								diceResult={result}
								ref={index == diceHistory.length - 1 ? ref : undefined}
							/>
						))}
					</div>
					{resetHistory && (
						<ResetButton onClick={resetHistory}>
							<Image
								src={ResetIcon}
								alt="Reset"
								width={40}
								height={40}
							/>
						</ResetButton>
					)}
				</>
			) : (
				<div style={{ margin: "auto" }}>
					<UIBasics.Header
						headerType="h2"
						textColor="gray"
						textAlign="center">
						Histórico Vazio
					</UIBasics.Header>
				</div>
			)}
		</UIBasics.Box>
	);
}
