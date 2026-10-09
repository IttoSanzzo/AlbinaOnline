"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { useEffect, useRef, useState } from "react";
import { VttDiceResult } from "../../../Types/Classes/VttDiceResult";
import { Guid } from "@/libs/stp@types";
import Image from "next/image";
import DiceRollerCrop from "@/../public/general-assets/DiceRollerCrop.png";
import {
	setVttElementDataAttributes,
	setVttElementHoverInteraction,
	VttElementDataAttribute,
} from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/Classes/VttMouseState";
import { useLocalStorageState } from "@/utils/Storage";
import { VttDiceResultView } from "./VttDiceResultView";
import { useVttMembersContext } from "../../../Contexts/VttMembersProvider";
import toast, { Toaster } from "react-hot-toast";

const DiceHistoryContainer = newStyledElement.div(styles.diceHistoryContainer);
const DiceBoxOpenButton = newStyledElement.span(styles.diceBoxOpenButton);
const DiceHistoryBox = newStyledElement.div(styles.diceHistoryBox);
const HistoryBackground = newStyledElement.span(styles.historyBackground);
const DiceHistoryResultsContainer = newStyledElement.div(
	styles.diceHistoryResultsContainer,
);

export function DiceHistory() {
	const { subscribe, send } = useVttContext();
	const { members } = useVttMembersContext();
	const [vttDiceResults, setVttDiceResults] = useState<VttDiceResult[]>([]);
	const [isOpen, setIsOpen] = useLocalStorageState<boolean>(
		"vtt-dice-box",
		false,
	);
	const shouldUserToast = useRef<boolean>(false);

	useEffect(() => {
		const unsubscribe = subscribe("VttAllDiceResults", (event) => {
			setVttDiceResults(event.data as VttDiceResult[]);
		});
		send({
			id: Guid.NewGuid(),
			path: "/dice/results",
			method: "Get",
			data: {},
		});
		return () => unsubscribe();
	}, [send, subscribe]);
	useEffect(() => {
		const unsubscribe = subscribe("VttDiceResult", (event) => {
			const vttDiceResult = event.data as VttDiceResult;
			setVttDiceResults((state) => [...state, vttDiceResult]);
			if (shouldUserToast.current) {
				const member = members.find(
					(member) => member.userId == vttDiceResult.userId,
				);
				toast.custom(
					<VttDiceResultView
						isFloat={false}
						vttDiceResult={vttDiceResult}
						memberImage={member?.user.iconUrl ?? DiceRollerCrop}
						memberName={member?.user.nickname ?? "???"}
					/>,
					{
						id: vttDiceResult.id,
						toasterId: "DiceToaster",
						position: "bottom-center",
						duration: 4000,
					},
				);
			}
		});
		return () => unsubscribe();
	}, [subscribe, members]);
	useEffect(() => {
		if (vttDiceResults.length == 0) return;
		const resultsContainer = document.querySelector(
			`.${styles.diceHistoryResultsContainer}`,
		) as HTMLElement | null;
		const thirdLatestIndex = Math.max(vttDiceResults.length - 3, 0);
		const thirdLatestElement = document.getElementById(
			`vtt-dice-box-history|${vttDiceResults[thirdLatestIndex].id}`,
		);
		if (!resultsContainer || !thirdLatestElement) return;

		const containerRect = resultsContainer.getBoundingClientRect();
		const elementRect = thirdLatestElement.getBoundingClientRect();
		const isVisible =
			elementRect.bottom > containerRect.top &&
			elementRect.top < containerRect.bottom;
		if (!isVisible) return;

		const lastDiceElement = document.getElementById(
			`vtt-dice-box-history|${vttDiceResults[vttDiceResults.length - 1].id}`,
		);

		if (!lastDiceElement) return;

		resultsContainer.scrollTo({
			top:
				lastDiceElement.offsetTop +
				lastDiceElement.offsetHeight -
				resultsContainer.clientHeight,
			behavior: "smooth",
		});
	}, [vttDiceResults]);
	useEffect(() => {
		shouldUserToast.current = !isOpen;
	}, [isOpen]);

	return (
		<DiceHistoryContainer>
			<DiceHistoryBox
				{...setVttElementDataAttributes(
					VttElementDataAttribute.EventMiddleButtonPanAncestral,
				)}
				className={styles[isOpen ? "isOpen" : "isClosed"]}>
				<HistoryBackground>
					<DiceHistoryResultsContainer
						id={"vtt-dice-history-results-container"}>
						{vttDiceResults.map((vttDiceResult) => {
							const member = members.find(
								(member) => member.userId == vttDiceResult.userId,
							);
							return (
								<VttDiceResultView
									key={vttDiceResult.id}
									isFloat={false}
									vttDiceResult={vttDiceResult}
									memberImage={member?.user.iconUrl ?? DiceRollerCrop}
									memberName={member?.user.nickname ?? "???"}
								/>
							);
						})}
					</DiceHistoryResultsContainer>
				</HistoryBackground>
			</DiceHistoryBox>
			{!isOpen && (
				<Toaster
					toasterId={"DiceToaster"}
					containerClassName={styles.diceToasterBox}
				/>
			)}
			<DiceBoxOpenButton
				{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
				onClick={() => {
					setIsOpen(!isOpen);
				}}>
				<Image
					src={DiceRollerCrop}
					alt={""}
					width={24}
					height={24}
					style={{
						userSelect: "none",
						WebkitUserSelect: "none",
					}}
				/>
			</DiceBoxOpenButton>
		</DiceHistoryContainer>
	);
}
