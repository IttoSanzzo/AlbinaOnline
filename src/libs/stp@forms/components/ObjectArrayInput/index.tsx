"use client";

import { StandartBackgroundColor } from "@/components/(UIBasics)";
import {
	CSSProperties,
	Dispatch,
	InputHTMLAttributes,
	ReactNode,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
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
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ObjectArrayInputContainer = newStyledElement.div(
	styles.objectArrayInputContainer,
);
const ObjectArraysContainer = newStyledElement.div(
	styles.objectArraysContainer,
);
const ObjectArrayInputFieldContainer = newStyledElement.div(
	styles.objectArrayInputFieldContainer,
);
const ObjectArrayInputReorderGrab = newStyledElement.span(
	styles.objectArrayInputReorderGrab,
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
	isReorderable?: boolean;
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
	isReorderable = false,
	...rest
}: ObjectArrayInputProps<TFormInput>) {
	const lastInputRef = useRef<HTMLInputElement | null>(null);
	const [dndIds, setDnDIds] = useState<string[]>([]);

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

	useEffect(() => {
		setDnDIds(
			Array.from({ length: (field.value as string[]).length }, () =>
				crypto.randomUUID(),
			),
		);
	}, []);

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

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = dndIds.indexOf(String(active.id));
		const newIndex = dndIds.indexOf(String(over.id));

		if (oldIndex === -1 || newIndex === -1) return;

		const newValue = [...field.value];
		const [movedValue] = newValue.splice(oldIndex, 1);
		newValue.splice(newIndex, 0, movedValue);

		const newDndIds = [...dndIds];
		const [movedId] = newDndIds.splice(oldIndex, 1);
		newDndIds.splice(newIndex, 0, movedId);

		setDnDIds(newDndIds);
		field.onChange(newValue);

		triggerDebounceAction();
	}

	return (
		<ObjectArrayInputContainer style={{ width: width }}>
			<ObjectArrayInputLabel
				children={`${label} - ${(field.value as string[]).length}`}
				style={labelStyle}
			/>
			{errorMessage && (
				<ObjectArrayInputError>{errorMessage}</ObjectArrayInputError>
			)}
			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}>
				<ObjectArraysContainer>
					<SortableContext
						items={dndIds}
						strategy={verticalListSortingStrategy}>
						{(field.value as string[]).map((value, index) => (
							<ObjectArrayInputField
								key={dndIds[index] ?? index}
								dndId={dndIds[index] ?? `${index}`}
								childrenGenerator={childrenGenerator}
								disabled={rest.disabled}
								field={field}
								setDndIds={setDnDIds}
								index={index}
								inputStyle={inputStyle}
								lastInputRef={lastInputRef}
								triggerDebounceAction={triggerDebounceAction}
								value={value}
								isReorderable={isReorderable}
							/>
						))}
					</SortableContext>
				</ObjectArraysContainer>
			</DndContext>
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
					setDnDIds((state) => [...state, crypto.randomUUID()]);
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

interface ObjectArrayInputFieldProps<TFormInput extends FieldValues> {
	childrenGenerator: (props: ChildGeneratorProps<TFormInput>) => ReactNode;
	field: ControllerRenderProps<TFormInput, keyof TFormInput & Path<TFormInput>>;
	index: number;
	inputStyle: CSSProperties;
	value: string;
	triggerDebounceAction: () => void;
	disabled?: boolean;
	lastInputRef: RefObject<HTMLInputElement | null>;
	isReorderable: boolean;
	dndId: string;
	setDndIds: Dispatch<SetStateAction<string[]>>;
}
function ObjectArrayInputField<TFormData extends FieldValues>({
	childrenGenerator,
	field,
	index,
	inputStyle,
	value,
	triggerDebounceAction,
	disabled,
	lastInputRef,
	isReorderable,
	dndId,
	setDndIds,
}: ObjectArrayInputFieldProps<TFormData>) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: dndId,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<ObjectArrayInputFieldContainer
			style={style}
			ref={setNodeRef}
			{...attributes}>
			{isReorderable && (
				<ObjectArrayInputReorderGrab
					tabIndex={-1}
					{...listeners}>
					<StpIcon
						name="List"
						style="bold"
						color="default"
					/>
				</ObjectArrayInputReorderGrab>
			)}
			<ObjectArrayInputInternalContainer
				children={childrenGenerator({
					field: field,
					index: index,
					lastRef: index == field.value.length - 1 ? lastInputRef : undefined,
					style: inputStyle,
					triggerDebounceAction: triggerDebounceAction,
					value: value,
				})}
			/>
			<ObjectArrayInputRemovalButton
				tabIndex={-1}
				disabled={disabled}
				type="button"
				onClick={(event) => {
					event.preventDefault();
					setDndIds((state) => [...state.filter((id) => id != dndId)]);
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
	);
}
