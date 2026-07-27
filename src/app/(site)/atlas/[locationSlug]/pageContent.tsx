import {
	GenericPageContainer,
	GenericPageFooter,
	StyledLink,
} from "@/components/(Design)";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { getCacheMode } from "@/utils/Cache";
import { convertEnumsFromResponse } from "@/utils/Data";
import {
	LocationData,
	LocationSubTypeName,
	LocationTypeName,
	WorldPlaneName,
} from "@/libs/stp@types";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { redirect } from "next/navigation";

interface LocationPageContentProps {
	locationSlug: string;
}
export default async function LocationPageContent({
	locationSlug,
}: LocationPageContentProps) {
	const response = await fetch(
		getAlbinaApiFullAddress(`/atlas/${locationSlug}`),
		{
			cache: getCacheMode(),
			next: { tags: [`/atlas`] },
		},
	);
	if (!response.ok) return redirect("/atlas");
	const locationData = convertEnumsFromResponse<LocationData>(
		await response.json(),
	);

	const richInfoTable = [];
	if (locationData.richInfo) {
		if (locationData.richInfo.population != undefined)
			richInfoTable.push(["População", locationData.richInfo.population]);
		if (locationData.richInfo.climate)
			richInfoTable.push(["Clima", locationData.richInfo.climate]);
		if (locationData.richInfo.currency)
			richInfoTable.push(["Moeda", locationData.richInfo.currency]);
		if (locationData.richInfo.economy)
			richInfoTable.push(["Economia", locationData.richInfo.economy]);
		if (locationData.richInfo.government)
			richInfoTable.push(["Governo", locationData.richInfo.government]);
		if (locationData.richInfo.languages)
			richInfoTable.push([
				"Línguas",
				locationData.richInfo.languages.join(", "),
			]);
	}

	return (
		<GenericPageContainer
			title={locationData.name}
			banner={locationData.bannerUrl}
			icon={locationData.iconUrl}
			subTitle={
				<div
					style={{
						display: "flex",
						color: StandartTextColor["darkGray"],
					}}>
					<StyledLink
						title={WorldPlaneName[locationData.worldPlane]}
						href={`/atlas/${locationData.worldPlane}`}
						icon={getAlbinaApiFullAddress(
							`/favicon/core-page/atlas/${locationData.worldPlane}`,
						)}
					/>
					{" _ "}
					<StyledLink
						title={LocationTypeName[locationData.type]}
						href={`/atlas`}
						icon={getAlbinaApiFullAddress("/favicon/core-page/atlas")}
					/>
					{" _ "}
					<StyledLink
						title={LocationSubTypeName[locationData.subType]}
						href={`/atlas`}
						icon={getAlbinaApiFullAddress("/favicon/core-page/atlas")}
					/>
				</div>
			}
			subTitle2={
				<StyledFalseLink
					withoutIcon
					title={locationData.isHidden ? "Não Listado" : "Listado"}
				/>
			}>
			<SetCurrentPageData
				type={"location"}
				data={locationData}
			/>
			<SetNavBarModules favoriteButton={FavoriteButton} />

			<StaticGallery
				url={getAlbinaApiFullAddress(`/images/atlas/${locationData.slug}`)}
				hideIfEmpty
			/>

			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder>
				<UIBasics.Header
					textColor="orange"
					headerType="h1"
					backgroundColor="gray"
					textAlign="center"
					children={"¤ Info ¤"}
				/>
				<GenericInfoMultiColumn info={locationData.info} />
			</UIBasics.Box>

			{locationData.richInfo && (
				<UIBasics.Box
					backgroundColor="darkGray"
					withoutBorder>
					<UIBasics.Header
						textColor="orange"
						headerType="h1"
						backgroundColor="gray"
						textAlign="center"
						children={"¤ Outros ¤"}
					/>
					<UIBasics.Table
						textColor="gray"
						tableData={{
							tableLanes: richInfoTable,
						}}
					/>
				</UIBasics.Box>
			)}

			<GenericPageFooter
				version={locationData.albinaVersion}
				lastUpdate={locationData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
