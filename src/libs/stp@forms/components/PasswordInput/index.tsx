import {
	PasswordInputContainer,
	PasswordInputError,
	PasswordInputLabel,
} from "./styledElements";
import { CSSProperties } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field";
import styles from "./styles.module.css";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface PasswordInputProps
	extends PasswordToggleField.PasswordToggleFieldInputProps {
	field: UseFormRegisterReturn;
	label: string;
	errorMessage?: string;
	fontSize?:
		| "xxs"
		| "xs"
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "6xl"
		| "7xl"
		| "8xl"
		| "9xl";
	lesserPadding?: boolean;
	textCentered?: boolean;
}
export function PasswordInput({
	field,
	label,
	errorMessage,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: PasswordInputProps) {
	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...style,
	};

	return (
		<PasswordToggleField.Root>
			<PasswordInputContainer>
				<PasswordInputLabel children={label} />
				{errorMessage && (
					<PasswordInputError>{errorMessage}</PasswordInputError>
				)}
				<PasswordToggleField.Input
					autoCapitalize="none"
					className={styles.passwordInputField}
					style={inputStyle}
					{...field}
					{...rest}
				/>
				<PasswordToggleField.Toggle className={styles.toggleButton}>
					<PasswordToggleField.Icon
						className={styles.toggleIcon}
						width={18}
						height={18}
						visible={<EyeOpenIcon />}
						hidden={<EyeClosedIcon />}
					/>
				</PasswordToggleField.Toggle>
			</PasswordInputContainer>
		</PasswordToggleField.Root>
	);
}
