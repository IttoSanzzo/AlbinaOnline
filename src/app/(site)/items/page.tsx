import { GenericPageContainer, StyledLink } from "@/components/(Design)";
import { NotionGridList } from "@/components/(UTILS)";
import { ItemData } from "@/libs/stp@types";

// type ItemData

export default async function Items() {
	const response = await fetch(`${process.env.ALBINA_API}/items`, {
		// cache: "force-cache",
	});
	const allRawItems: ItemData[] = await response.json();
	const allItems: ItemData[] = allRawItems.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<GenericPageContainer title="Todos os Items">
			<NotionGridList
				children={allItems.map((item) => {
					return (
						<StyledLink
							key={item.id}
							title={item.name}
							href={`items/${item.slug}`}
						/>
					);
				})}
			/>
		</GenericPageContainer>
	);
}
