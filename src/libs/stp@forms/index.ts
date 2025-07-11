export type { SelectWithIconOption } from "./components/SelectWithIcon/index";

import { Form } from "./components/Form";
import { SelectWithIcon } from "./components/SelectWithIcon";
import { TextInput } from "./components/TextInput";
import { PasswordInput } from "./components/PasswordInput";
import { SubmitButton } from "./components/SubmitButton";
import { Space } from "./components/Space";
import { SimpleMessage } from "./components/FailMessage";

export const HookedForm = {
	Form: Form,
	SubmitButton: SubmitButton,
	TextInput: TextInput,
	PasswordInput: PasswordInput,
	SelectWithIcon: SelectWithIcon,
	Space: Space,
	SimpleMessage: SimpleMessage,
};
