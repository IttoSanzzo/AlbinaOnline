import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const LoginFormInputContainer = newStyledElement.div(
	styles.loginFormInputContainer
);
export const LoginFormInputField = newStyledElement.input(
	styles.loginFormInputField
);
export const LoginFormInputTitle = newStyledElement.div(
	styles.loginFormInputTitle
);
export const LoginFormInputError = newStyledElement.div(
	styles.loginFormInputError
);
export const LoginButton = newStyledElement.button(styles.loginButton);
