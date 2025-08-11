import { CSSProperties } from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { StandartTextColor } from "../../core";

const DivisorContainer = newStyledElement.span(styles.divisorContainer);

interface DivisorProps {
	color?: keyof typeof StandartTextColor;
}

export function Divisor({ color = "default" }: DivisorProps) {
	const style: CSSProperties = {
		backgroundColor: `${StandartTextColor[color]}35`,
	};

	return <DivisorContainer style={style} />;
}
