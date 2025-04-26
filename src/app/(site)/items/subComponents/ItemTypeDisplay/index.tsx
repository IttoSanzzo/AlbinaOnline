import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { ItemData } from "@/libs/stp@types";

interface ItemTypeDisplayProps {
	title: string;
	items: ItemData[];
}

export default function ItemTypeDisplay({
	items,
	title,
}: ItemTypeDisplayProps) {
	return (
		<NotionBox
			backgroundColor="gray"
			withoutPadding>
			<NotionHeader
				textAlign="center"
				children={title}
			/>
			<NotionGridList
				backgroundColor="purple"
				children={items.map((item) => {
					return (
						<StyledLink
							key={item.id}
							title={item.name}
							href={`items/${item.slug}`}
						/>
					);
				})}
			/>
		</NotionBox>
	);
}
