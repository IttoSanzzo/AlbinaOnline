import { allAccessibleCharactersCache } from "@/libs/stp@cache";
import { Dialog, DropdownMenu } from "@/libs/stp@radix";

export function ClearSessionCache() {
	return (
		<Dialog.Root>
			<DropdownMenu.DialogTrigger
				onClick={(event) => {
					event.preventDefault();
					allAccessibleCharactersCache.invalidate("all");
					window.navigation.reload();
				}}
				iconProps={{ name: "Memory", style: "bold" }}>
				Limpar Cache
			</DropdownMenu.DialogTrigger>
		</Dialog.Root>
	);
}
