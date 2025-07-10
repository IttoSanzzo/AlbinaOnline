import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const TextInputContainer = newStyledElement.div(
	styles.textInputContainer
);
export const TextInputField = newStyledElement.input(styles.textInputField);
export const TextInputLabel = newStyledElement.label(styles.textInputLabel);
export const TextInputError = newStyledElement.div(styles.textInputError);
