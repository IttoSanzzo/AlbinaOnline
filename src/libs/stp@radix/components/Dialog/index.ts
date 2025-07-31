import * as DialogRadix from "@radix-ui/react-dialog";

import { Overlay } from "./Overlay";
import { Content } from "./Content";
import { Title } from "./Title";

export const Dialog = {
	Root: DialogRadix.Root,
	Trigger: DialogRadix.Trigger,
	Portal: DialogRadix.Portal,
	Overlay: Overlay,
	Content: Content,
	Title: Title,
	Description: DialogRadix.Description,
	Close: DialogRadix.Close,
};
