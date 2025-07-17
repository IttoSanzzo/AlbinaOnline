import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { Notion2Columns, NotionHeader } from "@/components/(NotionBased)";
import MasteryTypologyCallout from "./subComponents/ItemTypologyCallout";
import ItemPropertiesDisplay from "./subComponents/ItemPropertiesDisplay";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface ItemProps {
	params: Promise<{ itemSlug: string }>;
}

export default async function Item({ params }: ItemProps) {
	const { itemSlug } = await params;
	const ItemPageData = await getPageData(itemSlug);
	if (ItemPageData.itemData == undefined) {
		return <>Error</>;
	}
	const { itemData, borderColor } = ItemPageData;

	return (
		<GenericPageContainer
			title={itemData.name}
			banner={itemData.bannerUrl}
			icon={itemData.iconUrl}
			borderColor={borderColor}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"item"}
				data={itemData}
			/>

			<NotionHeader
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<Notion2Columns
				colum1={
					<MasteryTypologyCallout
						type={itemData.type}
						subType={itemData.subType}
					/>
				}
				colum2={<GenericInfoCallout info={itemData.info} />}
			/>
			<ItemPropertiesDisplay itemProperties={itemData.properties} />

			<GenericEffectsDisplay effects={itemData.effects} />
			<GenericPageFooter
				version={itemData.albinaVersion}
				lastUpdate={itemData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
