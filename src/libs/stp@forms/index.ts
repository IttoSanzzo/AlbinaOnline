export type { SelectOption } from "./components/Select/index";

import { Form } from "./components/Form";
import { SelectComponent } from "./components/Select";
import { MultiSelectComponent } from "./components/MultiSelect";
import { AsyncSearchSelect } from "./components/AsyncSearchSelect";
import { BoolInput } from "./components/BoolInput";
import { TextInput } from "./components/TextInput";
import { TextArrayInput } from "./components/TextArrayInput";
import { TextAreaInput } from "./components/TextAreaInput";
import { ObjectArrayInput } from "./components/ObjectArrayInput";
import { ObjectArrayTextInput } from "./components/ObjectArrayTextInput";
import { ObjectArraySelectInput } from "./components/ObjectArraySelectInput";
import { NumberInput } from "./components/NumberInput";
import { PasswordInput } from "./components/PasswordInput";
import { ImageInput } from "./components/ImageInput";
import { SubmitButton } from "./components/SubmitButton";
import { Space } from "./components/Space";
import { SimpleMessage } from "./components/FailMessage";
import { Separator } from "./components/Separator";

import { BaseTextInput } from "./components/base/BaseTextInput";
import { BaseSelect } from "./components/base/BaseSelect";

export * from "./context/HookedFormContext";
export type * from "./context/HookedFormContext";
export * from "./types";

export const HookedForm = {
	Form: Form,
	SubmitButton: SubmitButton,
	BoolInput: BoolInput,
	TextInput: TextInput,
	TextArrayInput: TextArrayInput,
	TextAreaInput: TextAreaInput,
	ObjectArrayInput: ObjectArrayInput,
	ObjectArrayTextInput: ObjectArrayTextInput,
	ObjectArraySelectInput: ObjectArraySelectInput,
	NumberInput: NumberInput,
	PasswordInput: PasswordInput,
	ImageInput: ImageInput,
	Select: SelectComponent,
	MultiSelect: MultiSelectComponent,
	AsyncSearchSelect: AsyncSearchSelect,
	Space: Space,
	Separator: Separator,
	SimpleMessage: SimpleMessage,
};

export const UnhookedForm = {
	TextInput: BaseTextInput,
	Select: BaseSelect,
};
