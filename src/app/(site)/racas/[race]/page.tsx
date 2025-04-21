import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { GenericPageContainer, GenericPageFooter } from "@/components/(Design)";
import {
	NotionText,
	NotionHeader,
	Notion2Columns,
	NotionCallout,
	NotionQuote,
	NotionToggle,
	NotionDivisor,
	NotionTable,
} from "@/components/(NotionBased)";

export { generateStaticParams, generateMetadata } from "./(routeInfra)";

interface RaceData {
	name: string;
}

interface RaceProps {
	params: Promise<{ race: string }>;
}

export default async function Race({ params }: RaceProps) {
	const { race } = await params;

	return (
		<GenericPageContainer
			title={`Raça - ${race.replace("-", " ")}`}
			banner={AlbinaLogo}
			icon={"/Mock/AlbinaLogo.png"}>
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
								》Feéricos
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
								》Raça principal
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
								Cultura, Comunidade e Curiosidades..:
							</NotionText>
						}>
						<NotionDivisor />
						<NotionCallout
							icon={{ name: "Sparkle", color: "orange" }}
							title={<NotionText>“Amados pela mana”</NotionText>}
						/>
						<NotionQuote textColor="default">
							Fadas são uma das raças primordiais, e aquela com a maior
							abundancia de mana em seus corpos. Claro, quantidade não quer
							dizer potencia, mas no que diz respeito ao elo com a mana, talvez
							não haja outra que chegue aos pés.
						</NotionQuote>
						<NotionQuote textColor="default">
							São uma raça alada e que possui no geral, um forte senso de
							liberdade e aventura. Elas possuem uma vida ligeiramente longa, em
							relação aos humanos, e uma sociedade muito mais estável e coerente
							em sua terra natal, fazendo com que fadas no geral sejam uma raça
							de… vida abençoada, ou era pra ser pelo menos.
						</NotionQuote>
						<NotionQuote textColor="default">
							Em um aspecto geral, é uma raça que não costuma ter contato com as
							demais, e objetivamente, não há nada como uma conexão em larga
							escala da sua sociedade central, para com os povos de outras
							raças. Bem, não é como se houvesse muitas oportunidades para isso
							de qualquer maneira.
						</NotionQuote>
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
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas são caixinhas de surpresa, nunca se sabe.
						</NotionQuote>
						<NotionQuote textColor="default">
							Elas podem possuir esse forte senso de liberdade, mas isso não
							significa que sejam idiotas aventureiros no geral. Elas apenas
							possuem… um elo mais profundo com o mundo, do que a maioria.
						</NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default">
							As fadas possuem uma profunda e rica cultura e historia, fundada
							no desenvolvimento de sua sociedade como um todo, e que conserva
							bem os contos dos tempo antigos, do que seria tido como a Era
							Primordial.
						</NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas possuem uma sociedade relativamente pacífica para com elas
							próprias, e dessa forma, fadas no geral tendem a se dar bem.
							Claro, existem certas divisões, muitas vezes pela essência da mana
							de cada um, mas aí, são casos e casos, e geralmente coletivos de
							uma região.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas são adoradas e muito bem queridas no geral, por todos os
							povos que partilham de sangue élfico.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas possuem uma relação muuuuuuuuuito complicada com humanos.
						</NotionQuote>
						<NotionQuote textColor="default">
							Fadas possuem uma relação neutra-ok, com todo o resto basicamente.
						</NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default">
							Fadas possuem forma humanoide, e tamanho extremamente próximo ao
							dos humanos. Seres dessa raça são dotados de orelhas levemente à
							extremamente pontudas, por muitas vezes arqueadas para baixo.
						</NotionQuote>
						<NotionQuote textColor="default">
							Elas também possuem asas, como uma forma de “órgão”, vital para
							sua existência, de aparência translúcida, e aspecto etéreo. Estas
							podem ser “retraídas” para dentro de seus corpos, são muitas vezes
							ilustradas de belos padrões desenhados naturalmente.
						</NotionQuote>
						<NotionQuote textColor="default">
							Também não é incomum que fadas possuam cabelo “colorido”,
							geralmente de acordo com sua essência feérica, apesar de não ser
							uma regra absoluta.
						</NotionQuote>
						<NotionQuote textColor="default">
							Exceto por esses detalhes, não existem realmente muitas
							características físicas que as diferenciam dos seres humanos,
							visualmente falando para os olhos comuns, claro.
						</NotionQuote>
						<NotionDivisor />
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
						<NotionDivisor />
						<NotionQuote textColor="default"></NotionQuote>
						<NotionDivisor />
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
							tableData={{
								tableLanes: [
									["Vitalidade", "🔸"],
									["Vigor", "🔸"],
									["Manapool", "🔺"],
									["Poder Físico", "🔸"],
									["Poder Mágico", "🔻"],
								],
							}}
							fixedLineSize={95}
						/>
					}
					colum2={
						<NotionTable
							tableData={{
								tableLanes: [
									["📏 Altura Média", "》 1,60m → 1,90m"],
									["⚓ Peso Médio", "》 55Kg"],
									["⏳ Longevidade", "》 ~120 anos"],
									["🥾 Deslocamento", "》 5m"],
									["🗣️ Língua Comum", "》 Feérico"],
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
				<NotionQuote textColor="default">
					Sangue Feérico Puro : Fadas costumam receber um favorecimento comum de
					espíritos e além de um corpo absurdamente compatível à diferentes
					formas de mana e magia, de quase qualquer natureza.
				</NotionQuote>
				<NotionQuote textColor="default">
					[Traço - Asas de
					Fada](https://www.notion.so/Tra-o-Asas-de-Fada-1340e0548e9e4e43889db7d5871ec3aa?pvs=21):
					As asas das fadas são majoritariamente mana, e podem ser expostas, e
					retraídas do corpo magicamente, além de armazenarem uma quantidade
					substancial de mana, que costuma estar imprópria para uso comum.
				</NotionQuote>
			</NotionCallout>
			<NotionCallout
				icon={{ name: "UserCircleGear", color: "yellow" }}
				titleColor="brown"
				title={"⪼ Resistências & Fraquezas & Imunidades"}>
				<Notion2Columns
					colum1={
						<NotionCallout
							icon={{ name: "ShieldChevron", color: "orange" }}
							textColor="orange"
							title={"⫷Resistências⫸"}>
							<NotionQuote textColor="default"></NotionQuote>
						</NotionCallout>
					}
					colum2={
						<NotionCallout
							icon={{ name: "ShieldWarning", color: "red" }}
							textColor="red"
							title={"⫷Fraqueza⫸"}>
							<NotionQuote textColor="default"></NotionQuote>
						</NotionCallout>
					}
				/>
				<NotionCallout
					icon={{ name: "ShieldCheck", color: "blue" }}
					textColor="blue"
					title={"⫷Imunidades⫸"}>
					<NotionQuote textColor="default"></NotionQuote>
				</NotionCallout>
			</NotionCallout>

			<NotionHeader
				textColor={"orange"}
				backgroundColor={"gray"}
				withUnderline={true}
				textAlign="center">
				🏮Habilidades Raciais🏮
			</NotionHeader>
			<NotionCallout
				icon={{ name: "ShootingStar", color: "orange" }}
				titleColor="orange"
				title={"》Essência Feérica"}>
				<NotionQuote></NotionQuote>
			</NotionCallout>
			<NotionCallout
				icon={{ name: "ShootingStar", color: "orange" }}
				titleColor="orange"
				title={"》Taumaturgia Feérica"}>
				<NotionQuote>
					[Skill - Taumaturgia
					Feérica](https://www.notion.so/Skill-Taumaturgia-Fe-rica-f64eb53801b4480abcbaa58272569eb6?pvs=21)
				</NotionQuote>
			</NotionCallout>
			<NotionCallout
				icon={{ name: "ShootingStar", color: "orange" }}
				titleColor="orange"
				title={"》Voo Feérico"}>
				<NotionQuote>
					[Skill - Impulso
					Feérico](https://www.notion.so/Skill-Impulso-Fe-rico-ec7a8bb9a9124132b45eed0d31a6c3f9?pvs=21)
				</NotionQuote>
			</NotionCallout>

			<GenericPageFooter version="6.4.7" />
		</GenericPageContainer>
	);
}
