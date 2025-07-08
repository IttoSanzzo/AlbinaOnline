import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";

import { DialogTriggerItem } from "./DialogTriggerItem";
import { AlertDialogTriggerItem } from "./AlertDialogTriggerItem";
import { Item } from "./Item";
import { Arrow } from "./Arrow";
import { Separator } from "./Separator";
import { Content } from "./Content";

export const DropdownMenu = {
	Root: DropdownMenuRadix.Root,
	Trigger: DropdownMenuRadix.Trigger,
	Portal: DropdownMenuRadix.Portal,
	DialogTrigger: DialogTriggerItem,
	AlertDialogTrigger: AlertDialogTriggerItem,
	Content: Content,
	Item: Item,
	Arrow: Arrow,
	Separator: Separator,
};
