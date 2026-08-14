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
import { MechanicalAbilityViewer } from "./page.components/MechanicalAbilityViewer";

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

	const passiveMechanicalAbilities = creatureData.mechanicalAbilities
		.filter((x) => x.trigger == "Passive")
		.sort((a, b) => a.order - b.order);
	const nonPassiveMechanicalAbilities = creatureData.mechanicalAbilities
		.filter((x) => x.trigger != "Passive")
		.sort((a, b) => a.order - b.order);

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

			{creatureData.mechanicalAbilities.length > 0 && (
				<UIBasics.Box
					backgroundColor="darkGray"
					withoutPadding>
					<UIBasics.MultiColumn.Two
						withoutColum1={passiveMechanicalAbilities.length == 0}
						withoutColum2={nonPassiveMechanicalAbilities.length == 0}
						colum1={
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									width: "100%",
								}}>
								{passiveMechanicalAbilities.map((ability, index) => (
									<MechanicalAbilityViewer
										key={ability.id}
										mechanicalAbility={ability}
										withoutMargin={
											index == passiveMechanicalAbilities.length - 1
										}
									/>
								))}
							</div>
						}
						colum2={
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									width: "100%",
								}}>
								{nonPassiveMechanicalAbilities.map((ability, index) => (
									<MechanicalAbilityViewer
										key={ability.id}
										mechanicalAbility={ability}
										withoutMargin={
											index == nonPassiveMechanicalAbilities.length - 1
										}
									/>
								))}
							</div>
						}
					/>
				</UIBasics.Box>
			)}

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
					children={`¤ ${creatureData.name} ¤`}
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
