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
} from "@/libs/stp@types";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { GenericInfoMultiColumn } from "@/components/(Design)/components/GenericInfoMultiColumn";
import { StyledFalseLink } from "@/components/(Design)/components/StyledFalseLink";
import { redirect } from "next/navigation";

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
						title={CreatureTypeName[creatureData.type]}
						href={`/bestiario#${creatureData.type}`}
						icon={getAlbinaApiFullAddress(creatureData.iconUrl)}
					/>
					{" _ "}
					<StyledLink
						title={CreatureSubTypeName[creatureData.subType]}
						href={`/bestiario#${creatureData.subType}`}
						icon={getAlbinaApiFullAddress("/favicon/core-page/bestiary")}
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

			<StaticGallery
				url={getAlbinaApiFullAddress(`/gallery/bestiary/${creatureData.slug}`)}
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
				<GenericInfoMultiColumn info={creatureData.info} />
			</UIBasics.Box>

			<GenericPageFooter
				version={creatureData.albinaVersion}
				lastUpdate={creatureData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
