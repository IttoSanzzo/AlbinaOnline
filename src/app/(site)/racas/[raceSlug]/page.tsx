import {
	GenericEffectsDisplay,
	GenericPageContainer,
	GenericPageFooter,
} from "@/components/(Design)";
import {
	NotionText,
	NotionHeader,
	Notion2Columns,
	NotionCallout,
	NotionToggle,
	NotionDivisor,
	NotionTable,
} from "@/components/(NotionBased)";
import { getPageData } from "./(routeInfra)";
import { NotionQuoteList } from "@/components/(UTILS)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface RaceProps {
	params: Promise<{ raceSlug: string }>;
}

function getParameterIcon(degree: number) {
	switch (degree) {
		case 0:
			return "0";
		case 1:
			return "🔻";
		case 2:
			return "🔸";
		case 3:
			return "🔺";
	}
}

export default async function Race({ params }: RaceProps) {
	const { raceSlug } = await params;
	const RacePageData = await getPageData(raceSlug);
	if (RacePageData.raceData == undefined) {
		return <>Error</>;
	}
	const { raceData, borderColor } = RacePageData;

	return (
		<GenericPageContainer
			title={`Raça - ${raceData.name}`}
			banner={raceData.bannerUrl}
			icon={raceData.iconUrl}>
			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Informações Gerais🏮
			</NotionHeader>
			<NotionCallout
				icon={{ name: "Shuffle", color: "purple" }}
				titleColor="purple"
				title={"⫷Tipologia⫸"}>
				<Notion2Columns
					colum1={
						<NotionCallout
							icon={{ name: "TreeEvergreen", color: "pink" }}
							backgroundColor="pink"
							titleColor="pink"
							title={"💮Árvore:"}>
							<NotionText
								textColor="pink"
								withBold
								withItalic>
								{`》${raceData.type}`}
							</NotionText>
						</NotionCallout>
					}
					colum2={
						<NotionCallout
							icon={{ name: "TreeEvergreen", color: "yellow" }}
							backgroundColor="yellow"
							titleColor="yellow"
							title={"🏵️Relação:"}>
							<NotionText
								textColor="yellow"
								withBold
								withItalic>
								{`》${raceData.subType}`}
							</NotionText>
						</NotionCallout>
					}
				/>
			</NotionCallout>
			<NotionCallout
				icon={{ name: "Cards", color: "red" }}
				titleColor="red"
				title={"⫷Informações Gerais⫸"}>
				<NotionDivisor />
				<NotionCallout
					icon={{ name: "BookOpen", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Cultura, Comunidade e Curiosidades..:"}>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Cultura, Comunidade e Curiosidades..:
							</NotionText>
						}>
						<NotionDivisor />
						<NotionCallout
							icon={{ name: "Sparkle", color: "orange" }}
							title={<NotionText>{raceData.info.introduction[0]}</NotionText>}
						/>
						<NotionQuoteList
							textColor="default"
							quotes={raceData.info.introduction.slice(1)}
						/>
						<NotionDivisor />
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Personalidade Comum
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.personality}
						/>
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Traços de Cultura
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.culture}
						/>
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Miscelâneas
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.miscellaneous}
						/>
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Palheta de Agremiações
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.groups}
						/>
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Relacionamento Interracial
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.relations}
						/>
					</NotionToggle>
				</NotionCallout>
				<NotionCallout
					icon={{ name: "PersonArmsSpread", color: "yellow", style: "fill" }}
					titleColor="yellow"
					title={"Aparência e Fisiologia..:"}>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Descrição
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.description}
						/>
					</NotionToggle>
					<NotionToggle
						textColor="orange"
						title={
							<NotionText
								withUnderline
								withItalic>
								》Imagens
							</NotionText>
						}>
						<NotionQuoteList
							textColor="default"
							withDivisor
							quotes={raceData.info.images}
						/>
					</NotionToggle>
				</NotionCallout>
			</NotionCallout>

			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Características🏮
			</NotionHeader>
			<NotionCallout
				icon={{ name: "SketchLogo", color: "yellow" }}
				titleColor="yellow"
				title={["⫦Parâmetros⫣", "⫦Gerais⫣"]}>
				<Notion2Columns
					colum1={
						<NotionTable
							fixedLineSize={90}
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
						<NotionTable
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
			</NotionCallout>

			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Traços Raciais🏮
			</NotionHeader>
			<NotionCallout
				icon={{ name: "UserCircle", color: "yellow" }}
				titleColor="brown"
				title={"⪼ Outros Traços"}>
				{/* <GenericEffectsDisplay effects={raceData.traitSlugs} /> */}
			</NotionCallout>
			{/* <NotionCallout
				icon={{ name: "UserCircleGear", color: "yellow" }}
				titleColor="brown"
				title={"⪼ Resistências & Fraquezas & Imunidades"}>
				<Notion2Columns
					colum1={
						<NotionCallout
							icon={{ name: "ShieldChevron", color: "orange" }}
							textColor="orange"
							title={"⫷Resistências⫸"}>
							<NotionQuoteList quotes={raceData.defensiveProfile.resistences} />
						</NotionCallout>
					}
					colum2={
						<NotionCallout
							icon={{ name: "ShieldWarning", color: "red" }}
							textColor="red"
							title={"⫷Fraqueza⫸"}>
							<NotionQuoteList quotes={raceData.defensiveProfile.weaknesses} />
						</NotionCallout>
					}
				/>
				<NotionCallout
					icon={{ name: "ShieldCheck", color: "blue" }}
					textColor="blue"
					title={"⫷Imunidades⫸"}>
					<NotionQuoteList quotes={raceData.defensiveProfile.immunities} />
				</NotionCallout>
			</NotionCallout> */}

			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Habilidades Raciais🏮
			</NotionHeader>
			{/* <GenericEffectsDisplay effects={raceData.skillSlug} /> */}

			<GenericPageFooter
				version="6.4.7"
				lastUpdate={raceData.updatedAt}
			/>
		</GenericPageContainer>
	);
}
