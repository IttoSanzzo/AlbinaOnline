"use client";

export type { SelectOption } from "./components/Select/index";

import { Form } from "./components/Form";
import { SelectComponent } from "./components/Select";
import { MultiSelectComponent } from "./components/MultiSelect";
import { TextInput } from "./components/TextInput";
import { TextAreaInput } from "./components/TextAreaInput";
import { NumberInput } from "./components/NumberInput";
import { NumberInputInline } from "./components/NumberInputInline";
import { PasswordInput } from "./components/PasswordInput";
import { ImageInput } from "./components/ImageInput";
import { SubmitButton } from "./components/SubmitButton";
import { Space } from "./components/Space";
import { SimpleMessage } from "./components/FailMessage";
import { Separator } from "./components/Separator";

export * from "./context/HookedFormContext";
export type * from "./context/HookedFormContext";
export * from "./types";

export const HookedForm = {
	Form: Form,
	SubmitButton: SubmitButton,
	TextInput: TextInput,
	TextAreaInput: TextAreaInput,
	NumberInputInline: NumberInputInline,
	NumberInput: NumberInput,
	PasswordInput: PasswordInput,
	ImageInput: ImageInput,
	Select: SelectComponent,
	MultiSelect: MultiSelectComponent,
	Space: Space,
	Separator: Separator,
	SimpleMessage: SimpleMessage,
};
