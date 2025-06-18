import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const RegisterFormContainer = newStyledElement.form(
	styles.registerFormContainer
);
export const RegisterFailed = newStyledElement.div(styles.registerFailed);
export const RegisterButton = newStyledElement.button(styles.registerButton);
