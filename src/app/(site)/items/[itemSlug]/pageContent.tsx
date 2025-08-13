import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import MasteryTypologyCallout from "./subComponents/ItemTypologyCallout";
import ItemPropertiesDisplay from "./subComponents/ItemPropertiesDisplay";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";
import { ItemData } from "@/libs/stp@types";

interface ItemPageContentProps {
	itemSlug: string;
}
export default async function ItemPageContent({
	itemSlug,
}: ItemPageContentProps) {
	const response = await fetch(getAlbinaApiAddress(`/items/${itemSlug}`), {
		cache: getCacheMode(),
	});
	if (!response.ok) return <>Error</>;
	const itemData = convertEnumsFromResponse<ItemData>(await response.json());

	return (
		<GenericPageContainer
			title={itemData.name}
			banner={itemData.bannerUrl}
			icon={itemData.iconUrl}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"item"}
				data={itemData}
			/>

			<UIBasics.Header
				textColor="purple"
				backgroundColor="gray"
				textAlign="center"
				children={"¤ Especificações ¤"}
			/>
			<UIBasics.MultiColumn.Two
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
