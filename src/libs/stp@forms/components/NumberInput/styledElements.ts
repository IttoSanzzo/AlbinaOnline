import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const NumberInputContainer = newStyledElement.div(
	styles.numberInputContainer
);
export const NumberInputLabel = newStyledElement.label(styles.numberInputLabel);
export const NumberInputError = newStyledElement.div(styles.numberInputError);
