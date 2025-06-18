import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const RegisterFormInputContainer = newStyledElement.div(
	styles.registerFormInputContainer
);
export const RegisterFormInputField = newStyledElement.input(
	styles.registerFormInputField
);
export const RegisterFormInputTitle = newStyledElement.div(
	styles.registerFormInputTitle
);
export const RegisterFormInputError = newStyledElement.div(
	styles.registerFormInputError
);
