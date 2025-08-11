import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { HookedForm } from "@/libs/stp@forms";
import { Control } from "react-hook-form";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";

const GaugeSelectionContainer = newStyledElement.div(
	styles.gaugeSelectionContainer
);

interface GaugeSelectionProps {
	gauge: "Hp" | "Ep" | "Mp";
	control: Control<any>;
	currentMax: number;
	color: keyof typeof StandartTextColor;
}
export function GaugeSelection({
	gauge,
	control,
	currentMax,
	color,
}: GaugeSelectionProps) {
	return (
		<GaugeSelectionContainer>
			<HookedForm.NumberInputInline
				control={control}
				fieldName={`current${gauge}`}
				max={currentMax}
				color={color}
			/>
			<UIBasics.Text
				textAlign="center"
				textColor={color}
				children={`/ ${currentMax} + `}
			/>
			<HookedForm.NumberInputInline
				control={control}
				fieldName={`temporary${gauge}`}
				min={0}
				color={color}
			/>
		</GaugeSelectionContainer>
	);
}
