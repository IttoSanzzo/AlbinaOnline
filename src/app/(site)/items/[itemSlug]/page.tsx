import {
	GenericEffectsDisplay,
	GenericInfoCallout,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { Notion2Columns, NotionHeader } from "@/components/(NotionBased)";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import MasteryTypologyCallout from "./subComponents/ItemTypologyCallout";
import ItemPropertiesDisplay from "./subComponents/ItemPropertiesDisplay";

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

	itemData.properties = {
		attribute: "Mundano",
		slot: "1 Mão",
		// equipmentStats: {
		// 	damage: "1",
		// 	accuracy: "1",
		// 	defense: "1",
		// 	range: "1 Posição",
		// 	damageType: "Cortante",
		// },
		extras: [
			// ["Banana", "split"],
			// ["Que", "[@/[Maravilha]maestrias/arco-curto]"],
		],
	};

	return (
		<GenericPageContainer
			title={itemData.name}
			banner={AlbinaLogo}
			icon={itemData.iconUrl}
			borderColor={borderColor}>
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
			<GenericPageFooter version={itemData.albinaVersion} />
		</GenericPageContainer>
	);
}
