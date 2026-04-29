import { StyledLinkCard } from "@/components/(Design)";
import { UIBasics } from "@/components/(UIBasics)";
import { ItemData } from "@/libs/stp@types";

interface ItemTypeDisplayProps {
	allItems: ItemData[];
	type: string;
	title: string;
}

export default function ItemTypeDisplay({
	allItems,
	type,
	title,
}: ItemTypeDisplayProps) {
	const allItemsFromThisType = allItems.filter((item) => item.type === type);
	if (allItemsFromThisType.length === 0) return <></>;

	return (
		<UIBasics.Box
			backgroundColor="gray"
			withoutBorder
			withoutPadding>
			<UIBasics.Header
				children={title}
				textAlign="center"
				textColor="gray"></UIBasics.Header>
			<UIBasics.List.Grid
				backgroundColor="purple"
				columnWidth={100}
				direction="row"
				children={allItemsFromThisType.map((item) => {
					return (
						<StyledLinkCard
							key={item.id}
							title={item.name}
							href={`items/${item.slug}`}
							artworkUrl={item.iconUrl}
							size={100}
							layout="rectangle"
						/>
					);
				})}
			/>
		</UIBasics.Box>
	);
}
