"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import {
	CSSProperties,
	InputHTMLAttributes,
	ReactNode,
	RefObject,
	useRef,
} from "react";
import {
	ControllerRenderProps,
	FieldPathValue,
	FieldValues,
	Path,
	useController,
} from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { useHookedForm } from "../../context/HookedFormContext";
import { StpIcon } from "@/libs/stp@icons";
import { LintIgnoredAny } from "@/libs/stp@types";
import { startCase } from "lodash";

const ObjectArrayInputContainer = newStyledElement.div(
	styles.objectArrayInputContainer,
);
const ObjectArraysContainer = newStyledElement.div(
	styles.objectArraysContainer,
);
const ObjectArrayInputFieldContainer = newStyledElement.div(
	styles.objectArrayInputFieldContainer,
);
const ObjectArrayInputRemovalButton = newStyledElement.button(
	styles.objectArrayInputRemovalButton,
);
const ObjectArrayInputInternalContainer = newStyledElement.div(
	styles.objectArrayInputInternalContainer,
);
const ObjectArrayInputLabel = newStyledElement.label(
	styles.objectArrayInputLabel,
);
const ObjectArrayInputError = newStyledElement.div(
	styles.objectArrayInputError,
);
const TextArrayNewRowButton = newStyledElement.button(
	styles.textArrayNewRowButton,
);

interface ChildGeneratorProps<TFormInput extends FieldValues> {
	triggerDebounceAction: () => void;
	lastRef: RefObject<HTMLInputElement | null> | undefined;
	style: CSSProperties | undefined;
	index: number;
	field: ControllerRenderProps<TFormInput, keyof TFormInput & Path<TFormInput>>;
	value: LintIgnoredAny;
}

type ObjectArrayInputProps<TFormInput extends FieldValues> = {
	fieldName: Path<TFormInput>;
	label?: string;
	autoLabelFormatting?: boolean;
	defaultObject: object;
	defaultValue?: string[];
	childrenGenerator: (props: ChildGeneratorProps<TFormInput>) => ReactNode;
	labelBackground?: keyof typeof StandartBackgroundColor;
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
	fieldMinHeight?: CSSProperties["minHeight"];
	fieldHeight?: CSSProperties["height"];
	width?: CSSProperties["width"];
} & InputHTMLAttributes<HTMLInputElement>;

export function ObjectArrayInput<TFormInput extends FieldValues>({
	fieldName,
	autoLabelFormatting = true,
	label = autoLabelFormatting ? startCase(fieldName) : fieldName,
	defaultObject,
	defaultValue,
	childrenGenerator,
	labelBackground,
	lesserPadding = false,
	textCentered = false,
	fontSize,
	style,
	width,
	fieldMinHeight,
	fieldHeight,
	...rest
}: ObjectArrayInputProps<TFormInput>) {
	const lastInputRef = useRef<HTMLInputElement | null>(null);

	const {
		form: {
			control,
			formState: { errors },
		},
		triggerDebounceAction,
	} = useHookedForm<TFormInput>();
	const { field, fieldState } = useController({
		name: fieldName,
		control: control,
		defaultValue:
			(defaultValue as FieldPathValue<TFormInput, Path<TFormInput>>) ??
			([] as FieldPathValue<TFormInput, Path<TFormInput>>),
	});

	const inputStyle: CSSProperties = {
		...(fontSize && { fontSize: `var(--fs-${fontSize})` }),
		...(lesserPadding && { padding: "var(--sp-4) var(--sp-4)" }),
		...(textCentered && { textAlign: "center" }),
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
		...(fieldMinHeight && { minHeight: fieldMinHeight }),
		...(fieldHeight && { height: fieldHeight }),
		...style,
	};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	const errorIndex = Array.isArray(errors[fieldName])
		? errors[fieldName].findIndex(
				(error) => error && error.message != undefined,
			)
		: -1;
	const errorMessage: string | undefined =
		fieldState.error?.message ??
		(errorIndex != -1
			? (errors[fieldName] as unknown as LintIgnoredAny)[errorIndex].message
			: undefined);

	return (
		<ObjectArrayInputContainer style={{ width: width }}>
			<ObjectArrayInputLabel
				children={`${label} - ${(field.value as string[]).length}`}
				style={labelStyle}
			/>
			{errorMessage && (
				<ObjectArrayInputError>{errorMessage}</ObjectArrayInputError>
			)}
			<ObjectArraysContainer>
				{(field.value as string[]).map((value, index) => (
					<ObjectArrayInputFieldContainer key={index}>
						<ObjectArrayInputInternalContainer
							children={childrenGenerator({
								field: field,
								index: index,
								lastRef:
									index == field.value.length - 1 ? lastInputRef : undefined,
								style: inputStyle,
								triggerDebounceAction: triggerDebounceAction,
								value: value,
							})}
						/>
						<ObjectArrayInputRemovalButton
							tabIndex={-1}
							disabled={rest.disabled}
							type="button"
							onClick={(event) => {
								event.preventDefault();
								field.onChange([
									...(field.value as object[]).filter(
										(_, rmIndex) => index != rmIndex,
									),
								]);
							}}>
							<StpIcon
								name="Trash"
								style="thin"
								color="red"
							/>
						</ObjectArrayInputRemovalButton>
					</ObjectArrayInputFieldContainer>
				))}
			</ObjectArraysContainer>
			<TextArrayNewRowButton
				type="button"
				disabled={rest.disabled}
				className={
					(field.value as string[]).length == 0
						? styles.isEmptyArray
						: undefined
				}
				onClick={(event) => {
					event.preventDefault();
					field.onChange([...field.value, defaultObject]);
					setTimeout(() => {
						if (lastInputRef.current) lastInputRef.current.focus();
					}, 100);
				}}>
				<StpIcon
					name="ArrowLineDown"
					color="default"
					style="thin"
				/>
			</TextArrayNewRowButton>
		</ObjectArrayInputContainer>
	);
}
