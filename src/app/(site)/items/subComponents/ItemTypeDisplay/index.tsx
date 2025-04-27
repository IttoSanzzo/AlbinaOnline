import { StyledLink } from "@/components/(Design)";
import { NotionBox, NotionHeader } from "@/components/(NotionBased)";
import { NotionGridList } from "@/components/(UTILS)";
import { ItemData } from "@/libs/stp@types";

interface ItemTypeDisplayProps {
	allItems: ItemData[];
	type: string;
	subTypesOrder?: string[];
	title: string;
}

export default function ItemTypeDisplay({
	allItems,
	type,
	subTypesOrder,
	title,
}: ItemTypeDisplayProps) {
	const allItemsFromThisType = allItems.filter((item) => item.type === type);

	if (!subTypesOrder)
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
					children={allItemsFromThisType.map((item) => {
						return (
							<StyledLink
								key={item.id}
								title={item.name}
								href={`items/${item.slug}`}
								icon={item.iconUrl}
							/>
						);
					})}
				/>
			</NotionBox>
		);
	const allItemsFromThisTypeOrdened: ItemData[] = [];
	subTypesOrder.forEach((subType) => {
		allItemsFromThisType.forEach((item) => {
			if (item.subType === subType) allItemsFromThisTypeOrdened.push(item);
		});
	});

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
				children={allItemsFromThisTypeOrdened.map((item) => {
					return (
						<StyledLink
							key={item.id}
							title={item.name}
							href={`items/${item.slug}`}
							icon={item.iconUrl}
						/>
					);
				})}
			/>
		</NotionBox>
	);
}
