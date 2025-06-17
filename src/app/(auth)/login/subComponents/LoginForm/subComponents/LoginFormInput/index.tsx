import {
	LoginFormInputContainer,
	LoginFormInputError,
	LoginFormInputField,
	LoginFormInputTitle,
} from "./styledElements";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type LoginFormInputProps = {
	field: UseFormRegisterReturn;
	title: string;
	errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function LoginFormInput({
	field,
	title,
	errorMessage,
	...rest
}: LoginFormInputProps) {
	return (
		<LoginFormInputContainer>
			<LoginFormInputTitle children={title} />
			{errorMessage && (
				<LoginFormInputError>{errorMessage}</LoginFormInputError>
			)}
			<LoginFormInputField
				{...field}
				{...rest}
			/>
		</LoginFormInputContainer>
	);
}
