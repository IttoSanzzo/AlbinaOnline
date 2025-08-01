export type { SelectWithIconOption } from "./components/SelectWithIcon/index";

import { Form } from "./components/Form";
import { SelectWithIcon } from "./components/SelectWithIcon";
import { TextInput } from "./components/TextInput";
import { TextAreaInput } from "./components/TextAreaInput";
import { NumberInput } from "./components/NumberInput";
import { NumberInputInline } from "./components/NumberInputInline";
import { PasswordInput } from "./components/PasswordInput";
import { SubmitButton } from "./components/SubmitButton";
import { Space } from "./components/Space";
import { SimpleMessage } from "./components/FailMessage";
import { WatchedAction } from "./components/WatchedAction";
import { Separator } from "./components/Separator";

export const HookedForm = {
	Form: Form,
	SubmitButton: SubmitButton,
	TextInput: TextInput,
	TextAreaInput: TextAreaInput,
	NumberInputInline: NumberInputInline,
	NumberInput: NumberInput,
	PasswordInput: PasswordInput,
	SelectWithIcon: SelectWithIcon,
	Space: Space,
	Separator: Separator,
	SimpleMessage: SimpleMessage,
	WatchedAction: WatchedAction,
};
