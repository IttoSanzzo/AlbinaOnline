import { CSSProperties } from "react";
import { Control, Path, useController } from "react-hook-form";
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const PasswordInputContainer = newStyledElement.div(
	styles.passwordInputContainer
);
const PasswordInputLabel = newStyledElement.label(styles.passwordInputLabel);
const PasswordInputError = newStyledElement.div(styles.passwordInputError);

type ExtractFieldValues<T> = T extends Control<infer U> ? U : never;

interface PasswordInputProps<TControl extends Control<any>>
	extends PasswordToggleField.PasswordToggleFieldInputProps {
	control: TControl;
	fieldName: Path<ExtractFieldValues<TControl>>;
	label: string;
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
export function PasswordInput<TControl extends Control<any>>({
	control,
	fieldName,
	label,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: PasswordInputProps<TControl>) {
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
	});

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
				{fieldState.error && (
					<PasswordInputError>{fieldState.error.message}</PasswordInputError>
				)}
				<PasswordToggleField.Input
					autoCapitalize="none"
					className={styles.passwordInputField}
					style={inputStyle}
					{...field}
					value={field.value ?? ""}
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
