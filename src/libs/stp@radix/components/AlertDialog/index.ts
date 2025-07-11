import * as AlertDialogRadix from "@radix-ui/react-alert-dialog";

import { ButtonsContainer } from "./ButtonsContainer/index";
import { Overlay } from "./Overlay/index";
import { Content } from "./Content/index";
import { Title } from "./Title/index";
import { Description } from "./Description/index";
import { Cancel } from "./Cancel/index";
import { Action } from "./Action/index";

export const AlertDialog = {
	Root: AlertDialogRadix.Root,
	Trigger: AlertDialogRadix.Trigger,
	Portal: AlertDialogRadix.Portal,
	Overlay: Overlay,
	Content: Content,
	Title: Title,
	Description: Description,
	Cancel: Cancel,
	Action: Action,

	ButtonsContainer: ButtonsContainer,
};
