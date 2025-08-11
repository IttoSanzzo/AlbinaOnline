import { StyledLink } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
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
			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.Header
					textAlign="center"
					children={title}
				/>
				<UIBasics.List.Grid
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
			</UIBasics.Box>
		);
	const allItemsFromThisTypeOrdened: ItemData[] = [];
	subTypesOrder.forEach((subType) => {
		allItemsFromThisType.forEach((item) => {
			if (item.subType === subType) allItemsFromThisTypeOrdened.push(item);
		});
	});

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutPadding>
			<UIBasics.Header
				textAlign="center"
				children={title}
			/>
			<UIBasics.List.Grid
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
		</UIBasics.Box>
	);
}
