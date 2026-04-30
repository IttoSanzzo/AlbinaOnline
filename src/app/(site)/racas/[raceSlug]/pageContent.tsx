import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import { SetCurrentPageData, SetNavBarModules } from "@/libs/stp@hooks";
import { FavoriteButton } from "@/components/(SPECIAL)";
import { UIBasics } from "@/components/(UIBasics)";
import { RacialSkillsGridDisplay } from "./subComponents/RacialSkillsGridDisplay";
import { RacialTraitsGridDisplay } from "./subComponents/RacialTraitsGridDisplay";
import StaticGallery from "@/components/(SPECIAL)/components/Gallery/StaticGallery";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

function getParameterIcon(degree: number) {
	switch (degree) {
		case 0:
			return "0";
		case 1:
			return "🔻";
		case 2:
			return "🔹";
		case 3:
			return "🔺";
		case 4:
			return "⚜️";
	}
}
// 🪷🔶⚜️🔹🔻🔸🔅🔆🔺

interface RacePageContentProps {
	raceSlug: string;
}
export default async function RacePageContent({
	raceSlug,
}: RacePageContentProps) {
	const RacePageData = await getPageData(raceSlug);
	if (RacePageData.raceData == undefined) {
		return <>Error</>;
	}
	const { raceData } = RacePageData;

	return (
		<GenericPageContainer
			title={`Raça - ${raceData.name}`}
			banner={raceData.bannerUrl}
			icon={raceData.iconUrl}>
			<SetNavBarModules favoriteButton={FavoriteButton} />
			<SetCurrentPageData
				type={"race"}
				data={raceData}
			/>

			<UIBasics.Header
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Informações Gerais🏮
			</UIBasics.Header>
			<UIBasics.Callout
				icon={{ name: "Shuffle", color: "purple" }}
				titleColor="purple"
				title={"⫷Tipologia⫸"}>
				<UIBasics.MultiColumn.Two
					colum1={
						<UIBasics.Callout
							icon={{ name: "TreeEvergreen", color: "pink" }}
							backgroundColor="pink"
							titleColor="pink"
							title={"💮Árvore:"}>
							<UIBasics.Text
								textColor="pink"
								withBold
								withItalic>
								{`》[@/[${raceData.type}]racas]`}
							</UIBasics.Text>
						</UIBasics.Callout>
					}
					colum2={
						<UIBasics.Callout
							icon={{ name: "TreeEvergreen", color: "yellow" }}
							backgroundColor="yellow"
							titleColor="yellow"
							title={"🏵️Relação:"}>
							<UIBasics.Text
								textColor="yellow"
								withBold
								withItalic>
								{`》[@/[${raceData.subType}]racas]`}
							</UIBasics.Text>
						</UIBasics.Callout>
					}
				/>
			</UIBasics.Callout>
			<UIBasics.Callout
				icon={{ name: "Cards", color: "red" }}
				titleColor="red"
				title={"⫷Informações Gerais⫸"}>
				<UIBasics.Divisor />
				<UIBasics.Callout
					icon={{ name: "BookOpen", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Cultura, Comunidade e Curiosidades..:"}>
					<UIBasics.Toggle
						memoryId="introduction"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Cultura, Comunidade e Curiosidades..:
							</UIBasics.Text>
						}>
						<UIBasics.Divisor />
						<UIBasics.Callout
							icon={{ name: "Sparkle", color: "orange" }}
							title={
								<UIBasics.Text>{raceData.info.introduction[0]}</UIBasics.Text>
							}
						/>
						<UIBasics.List.Quote
							textColor="default"
							// quotes={raceData.info.introduction.slice(1)}
							quotes={["a"]}
						/>
						<UIBasics.Divisor />
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="personality"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Personalidade Comum
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.personality}
						/>
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="culture"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Traços de Cultura
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.culture}
						/>
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="miscellaneous"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Miscelâneas
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.miscellaneous}
						/>
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="groups"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Palheta de Agremiações
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.groups}
						/>
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="relations"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Relacionamento Interracial
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.relations}
						/>
					</UIBasics.Toggle>
				</UIBasics.Callout>
				<UIBasics.Callout
					icon={{ name: "PersonArmsSpread", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Aparência e Fisiologia..:"}>
					<UIBasics.Toggle
						memoryId="description"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Descrição
							</UIBasics.Text>
						}>
						<UIBasics.List.Quote
							textColor="default"
							withDivisor
							quotes={raceData.info.description}
						/>
					</UIBasics.Toggle>
					<StaticGallery
						url={getAlbinaApiFullAddress(`/images/races/${raceData.slug}`)}
						hideIfEmpty
					/>
				</UIBasics.Callout>
			</UIBasics.Callout>

			<UIBasics.Header
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Características🏮
			</UIBasics.Header>
			<UIBasics.Callout
				icon={{ name: "SketchLogo", color: "yellow" }}
				titleColor="yellow"
				title={["⫦Parâmetros⫣", "⫦Gerais⫣"]}>
				<UIBasics.MultiColumn.Two
					colum1={
						<UIBasics.Table
							fixedLinePositions={[1]}
							fixedLineWidths={[90]}
							tableData={{
								tableLanes: [
									[
										"Vitalidade",
										getParameterIcon(raceData.parameters.vitality),
									],
									["Vigor", getParameterIcon(raceData.parameters.vigor)],
									["Manapool", getParameterIcon(raceData.parameters.manapool)],
									[
										"Poder Físico",
										getParameterIcon(raceData.parameters.physicalPower),
									],
									[
										"Poder Mágico",
										getParameterIcon(raceData.parameters.magicalPower),
									],
								],
							}}
						/>
					}
					colum2={
						<UIBasics.Table
							tableData={{
								tableLanes: [
									["📏 Altura Média", `》 ${raceData.generals.height}`],
									["⚓ Peso Médio", `》 ${raceData.generals.weight}`],
									["⏳ Longevidade", `》 ${raceData.generals.longevity}`],
									["🥾 Deslocamento", `》 ${raceData.generals.speed}`],
									["🗣️ Língua Comum", `》 ${raceData.generals.language}`],
								],
							}}
						/>
					}
				/>
			</UIBasics.Callout>

			{/* <UIBasics.Callout
				icon={{ name: "UserCircleGear", color: "yellow" }}
				titleColor="brown"
				title={"⪼ Resistências & Fraquezas & Imunidades"}>
				<UIBasics.MultiColumn.Two
					colum1={
						<UIBasics.Callout
							icon={{ name: "ShieldChevron", color: "orange" }}
							textColor="orange"
							title={"⫷Resistências⫸"}>
							<UIBasics.List.Quote quotes={raceData.defensiveProfile.resistences} />
						</UIBasics.Callout>
					}
					colum2={
						<UIBasics.Callout
							icon={{ name: "ShieldWarning", color: "red" }}
							textColor="red"
							title={"⫷Fraqueza⫸"}>
							<UIBasics.List.Quote quotes={raceData.defensiveProfile.weaknesses} />
						</UIBasics.Callout>
					}
				/>
				<UIBasics.Callout
					icon={{ name: "ShieldCheck", color: "blue" }}
					textColor="blue"
					title={"⫷Imunidades⫸"}>
					<UIBasics.List.Quote quotes={raceData.defensiveProfile.immunities} />
				</UIBasics.Callout>
			</UIBasics.Callout> */}

			{raceData.traitSlugs.length > 0 && (
				<>
					<UIBasics.Header
						textColor={"orange"}
						backgroundColor={"gray"}
						withUnderline={true}
						textAlign="center">
						🏮Traços Raciais🏮
					</UIBasics.Header>
					<RacialTraitsGridDisplay traitSlugs={raceData.traitSlugs} />
				</>
			)}
			{raceData.skillSlugs.length > 0 && (
				<>
					<UIBasics.Header
						textColor={"orange"}
						backgroundColor={"gray"}
						withUnderline={true}
						textAlign="center">
						🏮Habilidades Raciais🏮
					</UIBasics.Header>
					<RacialSkillsGridDisplay skillSlugs={raceData.skillSlugs} />
				</>
			)}

			<GenericPageFooter
				version="6.4.7"
				lastUpdate={raceData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
