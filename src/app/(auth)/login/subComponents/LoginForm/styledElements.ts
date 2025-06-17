import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

export const LoginFormContainer = newStyledElement.form(
	styles.loginFormContainer
);
export const LoginFailed = newStyledElement.div(styles.loginFailed);
