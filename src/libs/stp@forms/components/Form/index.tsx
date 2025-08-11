import React from "react";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const FormContainer = newStyledElement.form(styles.formContainer);

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}
export function Form({ ...rest }: FormProps) {
	return <FormContainer {...rest} />;
}
