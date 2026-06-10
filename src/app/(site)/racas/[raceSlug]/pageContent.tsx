import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import { getPageData } from "./(routeInfra)";
import {
	SetAnchorNavigation,
	SetCurrentPageData,
	SetNavBarModules,
} from "@/libs/stp@hooks";
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
			<SetAnchorNavigation
				anchors={[
					{
						name: "🏮Especificações🏮",
						indentation: 0,
					},
					{
						name: "Informações Gerais",
						indentation: 0,
					},
					{
						name: "Cultura, Comunidade e Curiosidades",
						indentation: 1,
					},
					{
						name: "Introdução",
						indentation: 2,
					},
					{
						name: "Personalidade Comum",
						indentation: 2,
					},
					{
						name: "Traços de Cultura",
						indentation: 2,
					},
					{
						name: "Miscelâneas",
						indentation: 2,
					},
					{
						name: "Palheta de Agremiações",
						indentation: 2,
					},
					{
						name: "Relacionamento Interracial",
						indentation: 2,
					},
					{
						name: "Aparência e Fisiologia",
						indentation: 1,
					},
					{
						name: "Descrição",
						indentation: 2,
					},
					{
						name: "Galeria",
						indentation: 2,
					},
					{
						name: "🏮Características🏮",
						indentation: 0,
					},
					{
						name: "🏮Traços Raciais🏮",
						indentation: 0,
					},
					{
						name: "🏮Habilidades Raciais🏮",
						indentation: 0,
					},
				]}
			/>

			<UIBasics.Header
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Especificações🏮
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
				title={"⫷Informações Gerais⫸"}
				id="informacoes-gerais">
				<UIBasics.Divisor />
				<UIBasics.Callout
					icon={{ name: "BookOpen", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Cultura, Comunidade e Curiosidades..:"}
					id="cultura-comunidade-e-curiosidades">
					<UIBasics.Toggle
						id="introducao"
						memoryId="introduction"
						textColor="orange"
						title={
							<UIBasics.Text
								withUnderline
								withItalic>
								》Introdução
							</UIBasics.Text>
						}>
						<UIBasics.Divisor />
						<UIBasics.Callout
							icon={{ name: "Sparkle", color: "orange" }}
							title={
								<UIBasics.Text>
									{raceData.info.introduction.length > 0
										? raceData.info.introduction[0]
										: "Missing"}
								</UIBasics.Text>
							}
						/>
						<UIBasics.List.Quote
							textColor="default"
							quotes={
								raceData.info.introduction.length > 1
									? raceData.info.introduction.slice(1)
									: []
							}
						/>
						<UIBasics.Divisor />
					</UIBasics.Toggle>
					<UIBasics.Toggle
						memoryId="personality"
						id="personalidade-comum"
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
						id="tracos-de-cultura"
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
						id="miscelaneas"
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
						id="palheta-de-agremiacoes"
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
						id="relacionamento-interracial"
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
					id="aparencia-e-fisiologia"
					icon={{ name: "PersonArmsSpread", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Aparência e Fisiologia..:"}>
					<UIBasics.Toggle
						id="descricao"
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
