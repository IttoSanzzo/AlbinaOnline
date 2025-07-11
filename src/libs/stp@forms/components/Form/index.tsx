import React from "react";
import { FormContainer } from "./styledElements";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}
export function Form({ ...rest }: FormProps) {
	return <FormContainer {...rest} />;
}
