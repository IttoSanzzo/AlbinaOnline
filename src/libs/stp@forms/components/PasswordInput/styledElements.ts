import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const PasswordInputContainer = newStyledElement.div(
	styles.passwordInputContainer
);
export const PasswordInputLabel = newStyledElement.label(
	styles.passwordInputLabel
);
export const PasswordInputError = newStyledElement.div(
	styles.passwordInputError
);
