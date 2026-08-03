import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "@/components/(UIBasics)";

const SeparatorLine = newStyledElement.span(styles.separatorLine);

interface SeparatorProps {
	color?: keyof typeof StandartTextColor;
}
export function Separator({ color }: SeparatorProps) {
	return (
		<SeparatorLine
			style={color ? { backgroundColor: StandartTextColor[color] } : undefined}
		/>
	);
}
