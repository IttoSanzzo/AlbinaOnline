"use client";

import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import Image from "next/image";
import { DiceIconProps, DiceIcons } from "../../DiceIcons";
import { StandartDiceSideValue } from "../..";
import { DiceResults } from "@/libs/stp@types";
import { postDiceRoll } from "../DiceRollerCore";
import { HookedForm } from "@/libs/stp@forms";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ResetIcon from "@/../public/general-assets/CircularResetIcon.png";

const SimpleLeftHandContainer = newStyledElement.div(
	styles.simpleLeftHandContainer,
);
const ResetButton = newStyledElement.div(styles.resetButton);

const schema = z.object({
	iterations: z.coerce.number().min(1, "Mínimo de 1").max(100, "Máximo de 100"),
	count: z.coerce.number().min(1, "Mínimo de 1").max(100, "Máximo de 100"),
	advantage: z.coerce.number().min(-99, "Mínimo de 99").max(99, "Máximo de 99"),
	modifier: z.coerce
		.number()
		.min(-100000, "Mínimo de -100000")
		.max(100000, "Máximo de 100000"),
});
type FormData = z.infer<typeof schema>;

interface DiceMiscs {
	iterations: number;
	count: number;
	modifier: number;
	advantage: number;
}

interface DiceButtonProps extends DiceIconProps {
	addDiceResultToHistory: (diceResult: DiceResults) => void;
	sideValue: 2 | 4 | 6 | 8 | 10 | 12 | 20 | 100;
	getMiscValues: () => DiceMiscs;
}
function DiceButton({
	addDiceResultToHistory,
	sideValue,
	getMiscValues,
	primaryColor,
	secondaryColor,
	size,
}: DiceButtonProps) {
	async function rollDice() {
		const miscValues = getMiscValues();
		const diceExpression = `${miscValues.iterations > 1 ? `${miscValues.iterations}#` : ""}${miscValues.count}d${sideValue}${miscValues.advantage > 0 ? `A${miscValues.advantage}` : miscValues.advantage < 0 ? `a${Math.abs(miscValues.advantage)}` : ""}${miscValues.modifier > 0 ? `+${miscValues.modifier}` : miscValues.modifier < 0 ? `-${Math.abs(miscValues.modifier)}` : ""}`;
		const diceResult = await postDiceRoll(diceExpression);
		if (diceResult) addDiceResultToHistory(diceResult);
	}

	return (
		<button
			onClick={rollDice}
			title={`D${sideValue}`}>
			<Image
				src={DiceIcons[`d${sideValue}`]({ primaryColor, secondaryColor, size })}
				alt={`D${sideValue}`}
				width={size}
				height={size}
			/>
		</button>
	);
}

interface SimpleLeftHandProps {
	addDiceResultToHistory: (diceResult: DiceResults) => void;
	primaryColor: string;
	secondaryColor: string;
	size: number;
}
export function SimpleLeftHand({
	addDiceResultToHistory,
	primaryColor,
	secondaryColor,
	size,
}: SimpleLeftHandProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			advantage: 0,
			count: 1,
			iterations: 1,
			modifier: 0,
		},
	});
	const { watch, resetField } = form;

	function getMiscValues(): DiceMiscs {
		return {
			iterations: watch().iterations,
			count: watch().count,
			modifier: watch().modifier,
			advantage: watch().advantage,
		};
	}

	return (
		<SimpleLeftHandContainer>
			<UIBasics.List.Grid
				direction="row"
				columnWidth={100}
				withoutMargin
				withoutPadding
				withoutBorder
				children={[2, 4, 6, 8, 10, 12, 20, 100].map((sideValue) => (
					<DiceButton
						addDiceResultToHistory={addDiceResultToHistory}
						key={sideValue}
						sideValue={sideValue as StandartDiceSideValue}
						getMiscValues={getMiscValues}
						primaryColor={primaryColor}
						secondaryColor={secondaryColor}
						size={size}
					/>
				))}
			/>
			<UIBasics.Box
				withoutBorder
				withoutMargin
				withoutPadding>
				<HookedForm.Form
					form={form}
					className={styles.form}>
					<div>
						<HookedForm.NumberInput<FormData>
							fieldName={"iterations"}
							label={"Iterações"}
							style={{ height: 1 }}
							min={1}
							max={100}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName={"count"}
							label={"Contagem"}
							style={{ height: 1 }}
							min={1}
							max={100}
						/>
					</div>
					<div>
						<HookedForm.NumberInput<FormData>
							fieldName={"advantage"}
							label={"Vantagem"}
							style={{ height: 1 }}
							min={-99}
							max={99}
						/>
						<HookedForm.NumberInput<FormData>
							fieldName={"modifier"}
							label={"Modificador"}
							style={{ height: 1 }}
							min={-100000}
							max={100000}
						/>
					</div>
					<ResetButton
						onClick={() => {
							resetField("advantage");
							resetField("count");
							resetField("iterations");
							resetField("modifier");
						}}>
						<Image
							src={ResetIcon}
							alt="Reset"
							width={40}
							height={40}
						/>
					</ResetButton>
				</HookedForm.Form>
			</UIBasics.Box>
		</SimpleLeftHandContainer>
	);
}
