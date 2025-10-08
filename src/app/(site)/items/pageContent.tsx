"use client";

import { ItemData } from "@/libs/stp@types";
import ItemTypeDisplay from "./subComponents/ItemTypeDisplay";
import { UIBasics } from "@/components/(UIBasics)";
import { HookedForm } from "@/libs/stp@forms";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	filter: z.string().transform((filter) => filter.toLowerCase()),
});
type FormData = z.infer<typeof schema>;

interface PageContentProps {
	items: ItemData[];
}
export default function PageContent({ items }: PageContentProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			filter: "",
		},
	});
	const filter = form.watch().filter.toLowerCase();

	const filteredItems: ItemData[] =
		filter.length === 0
			? items
			: items.filter(
					(item) =>
						item.name.toLowerCase().includes(filter) ||
						item.type.toLowerCase().includes(filter) ||
						item.subType.toLowerCase().includes(filter)
			  );

	return (
		<UIBasics.Box
			backgroundColor="darkGray"
			withoutMargin>
			<HookedForm.Form form={form}>
				<HookedForm.TextInput<FormData>
					fieldName="filter"
					label="Filtro"
				/>
				{filteredItems.length === 0 && (
					<UIBasics.Header
						textAlign="center"
						textColor="gray"
						children="Nenhum Resultado"
					/>
				)}
			</HookedForm.Form>

			<ItemTypeDisplay
				title="Armamentos"
				allItems={filteredItems}
				type="Armament"
			/>
			<ItemTypeDisplay
				title="Focus"
				allItems={filteredItems}
				type="Focus"
			/>
			<ItemTypeDisplay
				title="Escudos"
				allItems={filteredItems}
				type="Shielding"
			/>
			<ItemTypeDisplay
				title="Frames"
				allItems={filteredItems}
				type="Frame"
			/>
			<ItemTypeDisplay
				title="Vestimentas Auxiliares"
				allItems={filteredItems}
				type="Wearable"
			/>
			<ItemTypeDisplay
				title="Acessórios"
				allItems={filteredItems}
				type="Accessory"
			/>
			<ItemTypeDisplay
				title="Consumíveis"
				allItems={filteredItems}
				type="Consumable"
			/>
			<ItemTypeDisplay
				title="Miscelâneos"
				allItems={filteredItems}
				type="Miscellaneous"
			/>
			<ItemTypeDisplay
				title="Ferramentas"
				allItems={filteredItems}
				type="Tool"
			/>
			<ItemTypeDisplay
				title="Especiais"
				allItems={filteredItems}
				type="Special"
			/>
			<ItemTypeDisplay
				title="Aleatórios"
				allItems={filteredItems}
				type="Random"
			/>
		</UIBasics.Box>
	);
}
