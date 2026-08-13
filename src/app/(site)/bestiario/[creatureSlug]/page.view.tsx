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
	CreatureData,
	CreatureSubTypeName,
	CreatureTypeName,
	GetAlignmentName,
	LifeStateName,
	SizeClassMasculineName,
} from "@/libs/stp@types";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { redirect } from "next/navigation";
import { CreatureViewer } from "./page.components/CreatureViewer";

interface CreaturePageViewProps {
	entitySlug: string;
}
export default async function CreaturePageView({
	entitySlug,
}: CreaturePageViewProps) {
	const response = await fetch(
		getAlbinaApiFullAddress(`/bestiary/${entitySlug}`),
		{
			cache: getCacheMode(),
			next: { tags: [`/bestiary`] },
		},
	);
	if (!response.ok) return redirect("/bestiario");
	const creatureData = convertEnumsFromResponse<CreatureData>(
		await response.json(),
	);

	return (
		<GenericPageContainer
			title={creatureData.name}
			banner={creatureData.bannerUrl}
			icon={creatureData.iconUrl}
			subTitle={
				<div
					style={{
						display: "flex",
						color: StandartTextColor["darkGray"],
					}}>
					<StyledLink
						title={CreatureSubTypeName[creatureData.subType]}
						href={`/bestiario#${creatureData.subType}`}
						icon={getAlbinaApiFullAddress("/favicon/core-page/bestiary")}
					/>
					{" _ "}
					<StyledFalseLink
						title={CreatureTypeName[creatureData.type]}
						// href={`/bestiario#${creatureData.type}`}
						// icon={getAlbinaApiFullAddress(creatureData.iconUrl)}
						withoutIcon
					/>
					{" _ "}
					<StyledFalseLink
						title={LifeStateName[creatureData.lifeState]}
						withoutIcon
					/>
					{" _ "}
					<StyledFalseLink
						title={
							SizeClassMasculineName[creatureData.miscMetrics.volume.sizeClass]
						}
						withoutIcon
					/>
					{" _ "}
					<StyledFalseLink
						title={GetAlignmentName(creatureData.alignment)}
						withoutIcon
					/>
				</div>
			}
			subTitle2={
				<StyledFalseLink
					withoutIcon
					title={creatureData.isHidden ? "Não Listado" : "Listado"}
				/>
			}>
			<SetCurrentPageData
				type={"creature"}
				data={creatureData}
			/>
			<SetNavBarModules favoriteButton={FavoriteButton} />

			<CreatureViewer creatureData={creatureData} />

			<UIBasics.Box
				backgroundColor="darkGray"
				withoutBorder>
				<UIBasics.Header
					textColor="orange"
					headerType="h1"
					backgroundColor="gray"
					textAlign="center"
					children={`¤ ${creatureData.name} ¤`}
				/>
				<GenericInfoMultiColumn info={creatureData.info} />
			</UIBasics.Box>

			<StaticGallery
				url={getAlbinaApiFullAddress(`/gallery/bestiary/${creatureData.slug}`)}
				hideIfEmpty
			/>

			<GenericPageFooter
				version={creatureData.albinaVersion}
				lastUpdate={creatureData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
