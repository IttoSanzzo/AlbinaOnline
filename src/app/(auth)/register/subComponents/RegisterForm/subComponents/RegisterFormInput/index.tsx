import {
	RegisterFormInputContainer,
	RegisterFormInputError,
	RegisterFormInputField,
	RegisterFormInputTitle,
} from "./styledElements";
import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type RegisterFormInputProps = {
	field: UseFormRegisterReturn;
	title: string;
	errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function RegisterFormInput({
	field,
	title,
	errorMessage,
	...rest
}: RegisterFormInputProps) {
	return (
		<RegisterFormInputContainer>
			<RegisterFormInputTitle children={title} />
			{errorMessage && (
				<RegisterFormInputError>{errorMessage}</RegisterFormInputError>
			)}
			<RegisterFormInputField
				{...field}
				{...rest}
			/>
		</RegisterFormInputContainer>
	);
}
