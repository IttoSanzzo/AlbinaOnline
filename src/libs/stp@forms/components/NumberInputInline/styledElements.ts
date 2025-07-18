import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const NumberInputFieldContainer = newStyledElement.div(
	styles.numberInputFieldContainer
);
export const NumberInputField = newStyledElement.input(styles.numberInputField);
export const NumberInputDecrementButton = newStyledElement.button(
	styles.numberInputDecrementButton
);
export const NumberInputIncrementButton = newStyledElement.button(
	styles.numberInputIncrementButton
);
