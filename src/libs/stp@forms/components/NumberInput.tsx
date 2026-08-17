"use client";

import { CSSProperties, InputHTMLAttributes } from "react";
import { Path } from "react-hook-form";
import clsx from "clsx";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./NumberInput.module.css";
import { startCase } from "lodash";
import { BaseNumberInput, BaseNumberInputProps } from "./base/BaseNumberInput";

const NumberInputContainer = newStyledElement.div(styles.numberInputContainer);
const NumberInputLabel = newStyledElement.label(styles.numberInputLabel);

interface NumberInputProps<TFormData>
	extends
		BaseNumberInputProps<TFormData>,
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			"color" | "min" | "max" | "step"
		> {
	fieldName: Path<TFormData>;
	label?: string;
	autoLabelFormatting?: boolean;
	lesserPadding?: boolean;
	width?: CSSProperties["width"];
	inline?: boolean;
	objectIndex?: number | null;
	objectKey?: string | null;
}

type NewType<TFormData> = NumberInputProps<TFormData>;

export function NumberInput<TFormData>({
	fieldName,
	objectKey = null,
	autoLabelFormatting = true,
	label = autoLabelFormatting
		? objectKey != null
			? startCase(objectKey)
			: startCase(fieldName)
		: objectKey != null
			? objectKey
			: fieldName,
	lesserPadding = false,
	style,
	width,
	className,
	inline = false,
	...rest
}: NewType<TFormData>) {
	if (inline)
		return (
			<BaseNumberInput
				fieldName={fieldName}
				className={clsx(className, "withButtonPadding")}
				style={style}
				{...rest}
			/>
		);
	return (
		<NumberInputContainer style={{ width }}>
			<NumberInputLabel children={label} />
			<BaseNumberInput
				fieldName={fieldName}
				className={clsx(className, "withButtonPadding")}
				style={{
					padding: lesserPadding
						? "var(--sp-4) var(--sp-4)"
						: "var(--sp-5) var(--sp-4)",
					...style,
				}}
				objectKey={objectKey}
				{...rest}
			/>
		</NumberInputContainer>
	);
}
