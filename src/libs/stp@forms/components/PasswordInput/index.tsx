import { CSSProperties } from "react";
import { FieldValues, Path, useController } from "react-hook-form";
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useHookedForm } from "../../context/HookedFormContext";

const PasswordInputContainer = newStyledElement.div(
	styles.passwordInputContainer
);
const PasswordInputLabel = newStyledElement.label(styles.passwordInputLabel);
const PasswordInputError = newStyledElement.div(styles.passwordInputError);

interface PasswordInputProps<TFormData>
	extends PasswordToggleField.PasswordToggleFieldInputProps {
	fieldName: Path<TFormData>;
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
export function PasswordInput<TFormData extends FieldValues>({
	fieldName,
	label,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	...rest
}: PasswordInputProps<TFormData>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormData>();
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
					onChange={(event) => {
						field.onChange(event);
						triggerDebounceAction();
					}}
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
